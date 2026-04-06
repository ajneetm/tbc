import { handleRequestError } from "../helper/handleRequestError";

const API_URL = process.env.NEXT_PUBLIC_API;

export const getSurvey = async (id: string) => {
  try { 
    const res = await fetch(`${API_URL}/services/survey/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 500) {
      throw new Error("Failed to fetch survey");
    }
    if (!res.ok) {
      await handleRequestError(res);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

export type SurveyItem = {
  id: string;
  question: string;
  score: string;
  rate: string;
  answerId: string;
  modalId: string;
  questionId: string;
};


export type Survey = {
  id: string;
  score: string;
  photo: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  business_type: string;
  age: string;
  capital: string;
  project_age: string;
  staff_count: string;
  data: SurveyItem[];
};