import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'AIzaSyCdmzoUAgM_tR4S29_aqoPxRQT5fwVcmcs');

export interface IntentAndEntities {
  intent: 'price_query' | 'compare_products' | 'other';
  products: string[];
}

interface GeminiResponse {
  response: {
    text: () => string;
  };
}

async function extractEntitiesWithGemini(question: string): Promise<IntentAndEntities> {
  try {
    const prompt = `Bạn là một hệ thống phân tích ngôn ngữ tự nhiên. Hãy phân tích câu hỏi sau và trả về kết quả theo format JSON.

Câu hỏi: "${question}"

Yêu cầu:
1. Xác định ý định (intent): 
   - "price_query" nếu hỏi về giá cả, chi phí, hoặc số tiền
   - "compare_products" nếu so sánh giữa các sản phẩm
   - "other" cho các trường hợp khác

2. Trích xuất tên sản phẩm (products): danh sách các sản phẩm được nhắc đến trong câu hỏi
   - Bỏ qua các từ như "giá", "của", "là", "bao nhiêu"
   - Giữ lại tên đầy đủ của sản phẩm (ví dụ: "Sữa Ensure Gold", "iPhone 14 Pro Max")
   - Nếu là câu so sánh, tách riêng từng sản phẩm

Ví dụ:
Input: "Giá của Sữa Ensure là bao nhiêu?"
Output: {
  "intent": "price_query",
  "products": ["Sữa Ensure"]
}

Input: "So sánh iPhone 14 Pro Max với Samsung Galaxy S23"
Output: {
  "intent": "compare_products",
  "products": ["iPhone 14 Pro Max", "Samsung Galaxy S23"]
}

Chỉ trả về JSON, không thêm giải thích:`;

    const model: GenerativeModel = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
    const response: GeminiResponse = await model.generateContent(prompt);

    const text = response.response.text();

    try {
      const cleanText = text.replace(/```json\n|\n```/g, '').trim();
      return JSON.parse(cleanText) as IntentAndEntities;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', text);
      return basicExtraction(question);
    }
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return basicExtraction(question);
  }
}

function basicExtraction(question: string): IntentAndEntities {
  const lowerQ = question.toLowerCase();
  let intent: IntentAndEntities['intent'] = 'other';

  if (lowerQ.includes('so sánh') || lowerQ.includes('hơn')) {
    intent = 'compare_products';
  } else if (lowerQ.includes('giá')) {
    intent = 'price_query';
  }

  let products: string[] = [];

  if (intent === 'compare_products') {
    const parts = question.split(/với|so với|vs|v\/s/i);
    if (parts.length === 2) {
      const prod1 = parts[0].replace(/so sánh( giá)? của?/i, '').trim();
      const prod2 = parts[1].trim();
      products = [prod1, prod2];
    }
  } else {
    const productRegex = /([A-ZÀ-Ỵ][a-zà-ỹ0-9]+(?:\s+[A-ZÀ-Ỵa-zà-ỹ0-9]+){1,10})/g;
    const matches = question.match(productRegex) || [];
    products = matches.map((p) => p.trim()).filter((p) => p.split(' ').length >= 2);
  }

  return {
    intent,
    products,
  };
}

export async function identifyIntentAndEntities(question: string): Promise<IntentAndEntities> {
  try {
    const result = await extractEntitiesWithGemini(question);
    console.log('Gemini Analysis:', result);

    if (!result.products || result.products.length === 0) {
      console.log('No products found by Gemini, trying basic extraction...');
      const basicResult = basicExtraction(question);
      if (basicResult.products.length > 0) {
        console.log('Basic extraction found products:', basicResult.products);
        return {
          ...result,
          products: basicResult.products,
        };
      }
    }
    return result;
  } catch (error) {
    console.error('Error in entity extraction:', error);
    return basicExtraction(question);
  }
}
