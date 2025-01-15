import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
}) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        userData
    );
    return response.data;
};

export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        credentials
    );
    return response.data;
};
