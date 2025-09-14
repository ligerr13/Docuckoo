import axios, { AxiosResponse } from "axios";
import { cookies } from "next/dist/server/request/cookies";


const API_URL: String = 'http://localhost:8080/api/auth'

export interface SignInCredentials {
  userEmail: string;
  userPassword: string;
}

export default class AuthService {

    async signinUser(creds: SignInCredentials) {
        const res = await axios.post(
            `${API_URL}/signin`,
            creds,
            {
                withCredentials: true,
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            
        return res;
    }

    async signoutUser(){
        const res = await axios.post(
            `${API_URL}/signout`,
            null,
            {
                withCredentials: true,
                timeout: 10000,
            });

        return res;
    }
}