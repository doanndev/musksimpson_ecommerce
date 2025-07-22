from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Header, Depends, Body
from pydantic import BaseModel
from vector_store import init_vector_store
from chatbot import init_chatbot
from config import APP_HOST, APP_PORT
import uvicorn
import jwt  # pip install pyjwt
import os
from dotenv import load_dotenv
import json
import re
from connect_data import (
    get_mysql_connection,
    get_or_create_conversation,
    append_message_to_conversation,
    get_conversation,
    delete_conversation
)
from datetime import datetime


app = FastAPI(title="Product Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # ["POST", "GET", ...]
    allow_headers=["*"],  # ["Authorization", "Content-Type", ...]
)

# Initialize vector store and chatbot
vector_store = init_vector_store()
chatbot = init_chatbot()


class Query(BaseModel):
    text: str


class Product(BaseModel):
    uuid: str
    name: str
    description: str
    price: float
    weight: float
    stock: int
    category: str
    attributes: str


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def verify_token(authorization: str = Header(None)):
    if authorization is None:
        raise HTTPException(
            status_code=401, detail="Authorization header missing")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=401, detail="Invalid authorization header")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    return payload


def build_context_from_history(messages, max_turns=6):
    """Ghép các message gần nhất thành context cho chatbot, có đánh số thứ tự"""
    history = messages[-max_turns *
                       2:] if len(messages) > max_turns*2 else messages
    context_lines = []
    start_idx = len(messages) - len(history) + 1  # Đánh số bắt đầu từ 1
    for idx, msg in enumerate(history, start=start_idx):
        prefix = "Người dùng hỏi" if msg["sender"] == "user" else "Bot Trả lời"
        context_lines.append(f"{idx}. {prefix}: {msg['text']}")
    return "\n".join(context_lines)


@app.post("/chat")
async def chat(query: Query, token_payload: dict = Depends(verify_token)):
    try:
        user_id = token_payload.get("userId")
        if not user_id:
            return {"response": "Bạn cần đăng nhập để sử dụng trợ lý AI.", "data": [], "type": "unauthorized"}
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE uuid=%s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if not user:
            return {"response": "Bạn cần đăng nhập để sử dụng trợ lý AI.", "data": [], "type": "unauthorized"}

        # --- Lấy hoặc tạo conversation từ MongoDB ---
        conversation = get_or_create_conversation(user_id)
        messages = conversation.get("messages", [])
        # --- Build context từ lịch sử chat ---
        history_context = build_context_from_history(messages)

        # Get relevant products from vector store
        results = vector_store.query(query.text)
        if not results["documents"][0]:
            # Lưu message user và bot (không tìm thấy)
            append_message_to_conversation(
                user_id, "user", query.text, datetime.utcnow())
            append_message_to_conversation(
                user_id, "bot", "Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi của bạn.", datetime.utcnow())
            return {"response": "Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi của bạn."}
        # Generate context from retrieved documents
        context = history_context + "\n\n" + \
            "\n\n".join(results["documents"][0]) if history_context else "\n\n".join(
                results["documents"][0])
        # Generate response using chatbot
        ai_result = chatbot.generate_response(query.text, context)
        # Loại bỏ markdown
        json_str = re.sub(r"^```json|```$", "", ai_result,
                          flags=re.MULTILINE).strip()
        try:
            result = json.loads(json_str)
            print(result["data"])
            bot_text = result.get("response", ai_result)
            data = result.get("data", ai_result)
        except Exception:
            # Nếu lỗi parse, trả về raw text
            result = {"response": ai_result, "data": [], "type": "error"}
            bot_text = ai_result
        # Lưu message user và bot vào conversation
        append_message_to_conversation(
            user_id, "user", query.text, [], datetime.utcnow())
        append_message_to_conversation(
            user_id, "bot", bot_text, data, datetime.utcnow())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chat/conversations")
async def get_conversations(token_payload: dict = Depends(verify_token)):
    try:
        user_id = token_payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=401, detail="Unauthorized: UserId not found in token")

        # Verify user exists in MySQL
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE uuid=%s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            raise HTTPException(
                status_code=401, detail="Unauthorized: User not found")

        # Get conversation from MongoDB
        conversation = get_conversation(user_id)
        if not conversation:
            return {"messages": []}

        return {
            "messages": conversation.get("messages", []),
            "created_at": conversation.get("created_at"),
            "updated_at": conversation.get("updated_at")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chat/conversations")
async def delete_conversations(token_payload: dict = Depends(verify_token)):
    try:
        user_id = token_payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=401, detail="Unauthorized: UserId not found in token")

        # Verify user exists in MySQL
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE uuid=%s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            raise HTTPException(
                status_code=401, detail="Unauthorized: User not found")

        # Delete conversation from MongoDB
        success = delete_conversation(user_id)
        if not success:
            return {"message": "No conversation found to delete"}

        return {"message": "Conversation deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-product")
async def update_product_endpoint(product: dict = Body(...)):
    try:
        vector_store.update_product(product)
        return {"message": "Cập nhật sản phẩm thành công!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host=APP_HOST, port=APP_PORT)
