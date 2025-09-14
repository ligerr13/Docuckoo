import ApiService from "./apiService";
import axios from "axios";

export async function getUser() {
    const api: ApiService = new ApiService();
    
    try {
        const response = await api.Fetch("/api/home");
        
        return response.data;
        
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Unauthorized: Failed to fetch user data.");
        }
        
        throw error;
    }
}