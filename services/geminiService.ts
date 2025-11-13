
import { GoogleGenAI, Type } from "@google/genai";
import { FormData, GeminiResponse } from '../types';

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      description: "3개의 고유한 외식 추천 배열입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          restaurantType: { 
            type: Type.STRING, 
            description: "레스토랑 유형에 대한 창의적이고 매력적인 이름. 예: '아늑한 이탈리안 레스토랑', '활기찬 멕시코 음식점', '모던 일식 주점'." 
          },
          atmosphere: { 
            type: Type.STRING, 
            description: "레스토랑의 분위기와 느낌에 대한 간결하고 매력적인 설명." 
          },
          adultMenu: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "성인을 위한 3-4가지 구체적이고 흥미로운 메뉴 제안 목록."
          },
          kidMenu: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "아이들에게 매력적인 2-3가지 어린이 친화적 메뉴 제안 목록."
          },
          reasoning: { 
            type: Type.STRING, 
            description: "이 추천이 가족의 선호도에 왜 잘 맞는지 설명하는 짧은 단락." 
          }
        },
        required: ["restaurantType", "atmosphere", "adultMenu", "kidMenu", "reasoning"]
      }
    }
  },
  required: ["recommendations"]
};

export const getMenuRecommendation = async (formData: FormData): Promise<GeminiResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    당신은 전문 음식 평론가이자 창의적인 가족 외식 어드바이저입니다. 가족에게 흥미로운 식사 아이디어를 제공하는 것이 당신의 목표입니다.
    다음 기준에 따라 세 가지 독특하고 상세한 외식 추천 메뉴를 생성해주세요.

    가족 구성원: ${formData.members.join(', ')}
    선호하는 음식 종류: ${formData.cuisines.join(', ')}
    식단 관련 필요 또는 제한 사항: ${formData.restrictions.length > 0 ? formData.restrictions.join(', ') : '없음'}
    상황 / 분위기: ${formData.occasion}

    응답은 반드시 요청된 JSON 형식으로 제공해주세요. 각 추천은 고유해야 하며 제공된 정보에 맞춰져야 합니다. 
    창의력을 발휘하여 맛있고 매력적으로 들리도록 설명해주세요. 모든 설명과 메뉴 이름은 반드시 한국어로 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
        console.error("API로부터 잘못된 JSON 응답:", jsonText);
        throw new Error("AI로부터 잘못된 형식의 응답을 받았습니다.");
    }

    return JSON.parse(jsonText) as GeminiResponse;
  } catch (error) {
    console.error("Gemini API 호출 오류:", error);
    throw new Error("AI로부터 추천을 받는데 실패했습니다. 다시 시도해주세요.");
  }
};