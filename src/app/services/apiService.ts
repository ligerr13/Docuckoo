import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders, AxiosResponse, AxiosError } from 'axios';
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export default class ApiService {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: BACKEND,
            withCredentials: true,
        });

        this.instance.interceptors.request.use(async (config) => {
            const cookieStore = await cookies();
            const token = cookieStore.get('accessToken')?.value;

            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }

            return config;
        });
    }

    async Fetch(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        return this.instance(path, options);
    }

    async FetchAuth(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        try {
            return await this.instance(path, options);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await this.instance.post("/api/auth/refreshtoken");
                    return await this.instance(path, options);
                } catch (refreshError) {
                    throw new Error("Unauthorized: Token refresh failed.");
                }
            }
            throw error;
        }
    }
}