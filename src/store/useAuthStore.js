import { create } from "zustand";
import AuthService from "../services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  message: null,
  
  login: async (credentials) => {
    set({ isLoading: true, message: null });
    try {
      const response = await AuthService.login(credentials);
      
      // Chỉ lưu tokens vào localStorage
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      
      // Cập nhật state (user chỉ lưu trong memory)
      set({
        user: response.data,
        message: response.status.message,
        isLoading: false,
      });
      
      return { success: true, data: response };
    } catch (error) {
      // Xử lý error từ API
      const errorData = error.response?.data;
      
      set({
        user: null,
        message: errorData?.status?.message || "login_failed",
        isLoading: false,
      });
      
      return { success: false, error: errorData };
    }
  },
  
  register: async (data) => {
    set({ isLoading: true, message: null });
    try {
      const response = await AuthService.register(data);
      
      // Chỉ lưu tokens nếu có (một số API yêu cầu verify email trước)
      if (response.access_token) {
        localStorage.setItem("accessToken", response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem("refreshToken", response.refresh_token);
      }
      
      set({
        user: response.data,
        message: response.status.message,
        isLoading: false,
      });
      
      return { success: true, data: response };
    } catch (error) {
      const errorData = error.response?.data;
      
      set({
        user: null,
        message: errorData?.status?.message || "register_failed",
        isLoading: false,
      });
      
      return { success: false, error: errorData };
    }
  },
  
  logout: () => {
    // Chỉ xóa tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    set({
      user: null,
      message: null,
    });
  },
  
  clearErrors: () => {
    set({ message: null });
  },
}));