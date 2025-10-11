import { apiRequest } from "./api";

export interface AuthResponse {
  user: any;
  tokens: {
    access: string;
    refresh: string;
  };
}

export async function registerUser(data: any): Promise<AuthResponse> {
  return apiRequest("/accounts/register/", "POST", data);
}

export async function loginUser(data: any): Promise<AuthResponse> {
  return apiRequest("/accounts/login/", "POST", data);
}

export function saveAuthTokens(tokens: AuthResponse["tokens"]) {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
}

export function getAccessToken() {
  return localStorage.getItem("access");
}
