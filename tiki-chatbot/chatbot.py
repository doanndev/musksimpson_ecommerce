import google.generativeai as genai
from config import GOOGLE_API_KEY, GEMINI_MODEL


class Chatbot:
    def __init__(self):
        genai.configure(api_key=GOOGLE_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)

    def generate_response(self, query: str, context: str) -> str:
        """Sinh phản hồi sử dụng Gemini API"""
        prompt = f"""
        Dựa trên thông tin sản phẩm sau:
        {context}
        
        Hãy trả lời câu hỏi sau bằng tiếng Việt:
        {query}
        
        Yêu cầu:
        - Trả về kết quả dưới dạng một object JSON với các trường:
            - response: nội dung trả lời cho người dùng (trả lời thân thiện bằng tiếng Việt, ngắn gọn, dễ hiểu, nếu câu hỏi không liên quan tới sản phẩm thì hãy trả lời thân thiện sau đó hỏi người dùng về dịch vụ sản phẩm. Lưu ý không được trả về những thông tin nhạy cảm, không cần thiết ở phần này như uuid, user_id,...)
            - data: mảng các uuid sản phẩm (không được trả về uuid của sản phẩm ở phần response, bắt buộc phải trả về ở phần này)
            - type: loại thông tin trả về, ví dụ: "product"
        - Ví dụ:
        {{
          "response": "Sản phẩm A có giá 100.000 VNĐ và sản phẩm B có giá 200.000 VNĐ",
          "data": ["uuid1", "uuid2"],
          "type": "product"
        }}
        - Nếu không có thông tin liên quan, hãy trả về câu trả lời không tìm thấy hoặc trả lời câu hỏi không liên quan đó:
        - Ví dụ:
        {{
          "response": "Xin lỗi, tôi không tìm thấy thông tin phù hợp.",
          "data": [],
          "type": "none"
        }}
        Chỉ trả về object JSON, không trả thêm bất kỳ nội dung nào khác.
        """

        response = self.model.generate_content(prompt)
        return response.text


def init_chatbot():
    """Initialize chatbot"""
    return Chatbot()
