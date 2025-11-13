
export interface FormData {
  members: string[];
  cuisines: string[];
  restrictions: string[];
  occasion: string;
}

export interface Recommendation {
  restaurantType: string;
  atmosphere: string;
  adultMenu: string[];
  kidMenu: string[];
  reasoning: string;
}

export interface GeminiResponse {
  recommendations: Recommendation[];
}
