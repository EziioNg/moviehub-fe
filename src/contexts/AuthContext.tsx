"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  User,
} from "@/lib/auth";

// Login response interface
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

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  validateAuth: () => Promise<boolean>; // New method for lazy auth validation
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize auth state - don't check backend on load
  useEffect(() => {
    // Only restore from localStorage for UI persistence
    // Don't validate with backend - that's lazy loading
    const storedUser = localStorage.getItem("moviehub_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Invalid localStorage data, clear it
        localStorage.removeItem("moviehub_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      // Backend returns { accessToken, refreshToken, ...pickUser(existUser) }
      // So user data is at root level, not nested under 'user' property
      if (response && response._id) {
        const userWithLastLogin = {
          _id: response._id,
          email: response.email,
          username: response.username,
          role: response.role,
          avatar: response.avatar,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          _destroy: response._destroy,
          lastLogin: new Date().toISOString(),
        };

        setUser(userWithLastLogin);
        localStorage.setItem(
          "moviehub_user",
          JSON.stringify(userWithLastLogin),
        );
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await registerUser({
        email: userData.email,
        password: userData.password,
      });

      if (response) {
        // console.log("response after register: ", response);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Call backend to clear cookies
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear frontend state, even if backend call fails
      setUser(null);
      localStorage.removeItem("moviehub_user");
      setLoading(false);
    }
  };

  // Lazy auth validation - only call when needed
  const validateAuth = async (): Promise<boolean> => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("moviehub_user", JSON.stringify(currentUser));
        return true;
      } else {
        setUser(null);
        localStorage.removeItem("moviehub_user");
        return false;
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("moviehub_user");
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    validateAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
