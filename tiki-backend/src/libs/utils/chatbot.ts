import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'AIzaSyCdmzoUAgM_tR4S29_aqoPxRQT5fwVcmcs');

export async function runLLM(userQuestion: string, productData: string): Promise<string> {
  const prompt = `
Bạn là trợ lý bán hàng chuyên nghiệp của Vona, một trong những sàn thương mại điện tử lớn nhất Việt Nam.

${
  productData
    ? `Thông tin sản phẩm:
${productData}

Yêu cầu:
1. Sử dụng thông tin sản phẩm trên để trả lời câu hỏi
2. Luôn đề cập đến giá cụ thể của sản phẩm nếu có trong dữ liệu
3. Trả lời một cách chuyên nghiệp, thân thiện`
    : `Yêu cầu:
1. Trả lời câu hỏi một cách chuyên nghiệp, thân thiện
2. Nếu câu hỏi liên quan đến sản phẩm cụ thể mà không có thông tin, hãy hướng dẫn khách hàng tìm kiếm trên Vona
3. Với các câu hỏi chung về mua sắm, vận chuyển, thanh toán, hoặc dịch vụ của Vona, hãy cung cấp thông tin hữu ích
4. Luôn giữ thái độ nhiệt tình và sẵn sàng hỗ trợ
5. KHÔNG sử dụng emoji hoặc ký tự đặc biệt trong câu trả lời`
}

Câu hỏi của khách hàng: "${userQuestion}"
`;

  const model: GenerativeModel = ai.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const response = await model.generateContent(prompt);

  const cleanText = response.response
    .text()
    .replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{2702}-\u{27B0}\u{1F680}-\u{1F6FF}\u{24C2}-\u{1F251}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanText;
}
