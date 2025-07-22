import os
import mysql.connector
from dotenv import load_dotenv
import json
import pymongo
from datetime import datetime

load_dotenv()

def get_mysql_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        # password=os.getenv("MYSQL_PASSWORD", "root"),
        password="",
        database=os.getenv("MYSQL_DATABASE", "tiki_backend")
    )

def fetch_products():
    query = """
    SELECT p.uuid, p.name, p.description, p.new_price, p.weight, p.stock, c.name AS category,
           GROUP_CONCAT(CONCAT_WS(': ', pa.name, pa.value) SEPARATOR ' , ') AS attributes
    FROM products AS p
    JOIN product_attributes AS pa ON pa.product_id = p.id
    JOIN categories AS c ON c.id = p.category_id
    GROUP BY p.uuid, p.name, p.description, p.new_price, p.stock, c.name
    """
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results


# Test fetch
if __name__ == "__main__":
    products = fetch_products()
    for product in products:
        print(product)
    # Save to JSON file
    with open("app/data/products.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

def get_mongo_client():
    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    return pymongo.MongoClient(uri)

def get_conversation_collection():
    client = get_mongo_client()
    db_name = os.getenv("MONGO_DB", "tiki")
    db = client[db_name]
    return db["conversations"]

def get_conversation(user_id):
    """
    Get a conversation by user_id without creating a new one if it doesn't exist
    Returns None if no conversation is found
    """
    col = get_conversation_collection()
    return col.find_one({"user_id": user_id})

def get_or_create_conversation(user_id):
    col = get_conversation_collection()
    convo = col.find_one({"user_id": user_id})
    if convo:
        return convo
    now = datetime.utcnow()
    convo_doc = {
        "user_id": user_id,
        "messages": [],
        "created_at": now,
        "updated_at": now
    }
    col.insert_one(convo_doc)
    return convo_doc

def append_message_to_conversation(user_id, sender, text, data=[], timestamp=None):
    col = get_conversation_collection()
    if timestamp is None:
        timestamp = datetime.utcnow()
    message = {
        "sender": sender,
        "text": text,
        "data": data,
        "timestamp": timestamp
    }
    result = col.update_one(
        {"user_id": user_id},
        {
            "$push": {"messages": message},
            "$set": {"updated_at": timestamp}
        },
        upsert=True
    )
    return result

def delete_conversation(user_id):
    """
    Delete a conversation by user_id
    Returns True if conversation was deleted, False if no conversation was found
    """
    col = get_conversation_collection()
    result = col.delete_one({"user_id": user_id})
    return result.deleted_count > 0

get_mysql_connection()
