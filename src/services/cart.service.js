import { apiBase as api } from "./api";

const CartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const response = await api.get("/user/cart");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      throw error;
    }
  },

  // Thêm sách vào giỏ hàng
  addToCart: async (data) => {
    try {
      const response = await api.post("/user/cart/add", data);
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  },

  // Cập nhật số lượng sách trong giỏ hàng
  updateCartItem: async (data) => {
    try {
      const response = await api.patch(`/user/cart/update`, data);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      throw error;
    }
  },

  // Xóa sách khỏi giỏ hàng
  removeFromCart: async (bookId) => {
    try {
      const response = await api.delete(`/user/cart/remove/${bookId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
      throw error;
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const response = await api.delete("/user/cart/clear");
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      throw error;
    }
  },
};

export default CartService;
