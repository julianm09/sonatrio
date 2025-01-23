import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const transcribeFile = async (formData: FormData) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/content/transcribe`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const generateContent = async (formData: FormData) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/content/generate`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};