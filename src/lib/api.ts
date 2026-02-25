// API Configuration
import apiInstance from "./apiInstance";
import publicApiInstance from "./publicApiInstance";

// User interface
export interface User {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Login/Response interface
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Register data interface
export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Movie interface matching backend response
export interface Movie {
  _id: string;
  title: string;
  review: string;
  description: string;
  movieImage: string;
  movieURL: string;
  movieSub: string;
  categoryIds: string[];
  year?: number;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  _destroy: boolean;
}

// API Response interface for movies by category
export interface MoviesByCategoryResponse {
  movies: Movie[];
  totalMovies: number;
}

// Fetch movies by category ID
export async function getMoviesByCategoryId(
  categoryId: string,
): Promise<MoviesByCategoryResponse> {
  try {
    const response = await publicApiInstance.get(
      `/category/${categoryId}/movies`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movies for category ${categoryId}:`, error);
    throw error;
  }
}

// Fetch all movies (with pagination)
export async function getMovies(
  page: number = 1,
  itemsPerPage: number = 20,
): Promise<MoviesByCategoryResponse> {
  try {
    const response = await apiInstance.get(
      `/movies?movie=${page}&itemsPerPage=${itemsPerPage}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

// Fetch movie details by ID
export async function getMovieDetails(movieId: string): Promise<Movie> {
  try {
    const response = await apiInstance.get(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie details for ${movieId}:`, error);
    throw error;
  }
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await apiInstance.get(
      `/movies/search?query=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}

// Fetch categories
export async function getCategories(): Promise<any[]> {
  try {
    const response = await publicApiInstance.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Series interface
export interface Series {
  _id: string;
  name: string;
  description?: string;
  poster?: string;
}

// Get series by ID
export async function getSeriesById(seriesId: string): Promise<Series | null> {
  try {
    const response = await publicApiInstance.get(`/series/${seriesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching series:", error);
    return null;
  }
}

// Get movies by series ID
export async function getMoviesBySeriesId(
  seriesId: string,
): Promise<{ movies: Movie[] }> {
  try {
    const response = await publicApiInstance.get(`/series/${seriesId}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by series:", error);
    return { movies: [] };
  }
}

// Bookmark interface
export interface BookmarkMovie {
  _id: string;
  title: string;
  movieImage: string;
  rating?: number;
  year?: number;
}

// Get user's bookmarked movies
export async function getUserBookmarks(
  userId: string,
): Promise<BookmarkMovie[]> {
  try {
    const response = await apiInstance.get(`/users/${userId}/favorites`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    throw error;
  }
}

// Add movie to user's bookmarks
export async function addMovieToBookmarks(
  userId: string,
  movieId: string,
): Promise<any> {
  try {
    const response = await apiInstance.post(`/users/${userId}/favorites`, {
      movieId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie to bookmarks:", error);
    throw error;
  }
}

// Remove movie from user's bookmarks
export async function removeMovieFromBookmarks(
  userId: string,
  movieId: string,
): Promise<any> {
  try {
    const response = await apiInstance.delete(`/users/${userId}/favorites`, {
      data: { movieId },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing movie from bookmarks:", error);
    throw error;
  }
}

// ===== AUTHENTICATION FUNCTIONS =====

// User login
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

// User registration
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

// User logout
export async function logoutUser(): Promise<void> {
  try {
    await apiInstance.delete("/users/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiInstance.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}

// Forgot password
export async function forgotPassword(email: string): Promise<void> {
  try {
    await apiInstance.post("/users/forgot-password", { email });
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// Reset password
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  try {
    await apiInstance.put("/users/reset-password", { token, newPassword });
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>,
): Promise<User> {
  try {
    const response = await apiInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

// Verify email
export async function verifyEmail(
  // email: string | null,
  // token: string | null,
  data: any,
): Promise<any> {
  try {
    const response = await apiInstance.put("/users/verify", data);
    return response.data;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
}
