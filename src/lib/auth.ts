// API Configuration
import apiInstance from "./apiInstance";

// User interface matching backend response
export interface User {
  _id: string;
  email: string;
  username: string;
  role: "client" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  _destroy: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  email: string;
  username: string;
  role: "client" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  _destroy: boolean;
  accessToken: string;
  refreshToken: string;
}

// Auth API functions
export async function loginUser(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  try {
    const response = await apiInstance.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(
  userData: RegisterData,
): Promise<LoginResponse> {
  try {
    const response = await apiInstance.post("/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiInstance.delete("/users/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiInstance.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await apiInstance.post("/users/forgot-password", { email });
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  try {
    await apiInstance.post("/users/reset-password", { token, newPassword });
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

export async function updateUserProfile(
  userData: Partial<User>,
): Promise<User> {
  try {
    const response = await apiInstance.put("/users/update", userData);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

// Bookmark functions
export async function addFavoriteMovie(
  userId: string,
  movieId: string,
): Promise<void> {
  try {
    await apiInstance.post(`/users/${userId}/favorites`, { movieId });
  } catch (error) {
    console.error("Add favorite error:", error);
    throw error;
  }
}

export async function removeFavoriteMovie(
  userId: string,
  movieId: string,
): Promise<void> {
  try {
    await apiInstance.delete(`/users/${userId}/favorites`, {
      data: { movieId },
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    throw error;
  }
}

export async function getFavoriteMovies(userId: string): Promise<any[]> {
  try {
    const response = await apiInstance.get(`/users/${userId}/favorites`);
    return response.data;
  } catch (error) {
    console.error("Get favorites error:", error);
    throw error;
  }
}
