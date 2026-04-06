import { Program } from "@/types/service";
import { handleRequestError } from "../helper/handleRequestError";

const API_URL = process.env.NEXT_PUBLIC_API;

export const getProgramsList = async (): Promise<Program[]> => {
  try {
    const response = await fetch(`${API_URL}/services/programs-list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 500) {
      throw new Error("Failed to fetch programs");
    }

    if (!response.ok) {
       await handleRequestError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching programs list:", error);
    throw error;
  }
};

export const getProgram = async (id: string): Promise<Program> => {
  try {
    const response = await fetch(`${API_URL}/services/programs-list/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 500) {
      throw new Error("Failed to fetch programs");
    }

    if (!response.ok) {
       await handleRequestError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching programs list:", error);
    throw error;
  }
};
