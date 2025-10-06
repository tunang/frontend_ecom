import { create } from "zustand";
import AuthService from "../services/auth.service";
import { useCartStore } from "./useCartStore";

export const useAuthStore = create((set, get) => ({
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
  
  logout: async () => {
    try {
      const response = await AuthService.logout();
      console.log("Logout response:", response);
      // Chỉ xóa tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Reset cart state
      useCartStore.getState().resetCart();
      
      set({
        user: null,
        message: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
  },
  
  clearErrors: () => {
    set({ message: null });
  },
  
  // Khởi tạo user từ localStorage hoặc API
  initUser: async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    // Nếu không có token, không làm gì cả
    if (!accessToken) {
      set({ user: null, isLoading: false });
      return;
    }
    
    // Nếu có token, fetch user info từ API
    set({ isLoading: true });
    try {
      const response = await AuthService.getCurrentUser();
      
      set({
        user: response.data,
        isLoading: false,
      });
    } catch (error) {
      // Nếu token không hợp lệ, xóa token và reset state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));