import { apiBase as api } from "./api";

const OrderService = {
  // Tạo đơn hàng
  createOrder: async (data) => {
    try {
      console.log(data);
      const response = await api.post("/user/orders", data);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng
  getOrders: async (params) => {
    try {
      const response = await api.get("/user/orders", { params });
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (id) => {
    try {
      const response = await api.get(`/user/orders/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (id) => {
    try {
      const response = await api.put(`/user/orders/${id}/cancel`);
      return response;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  // Thanh toán lại đơn hàng
  repayOrder: async (stripeSessionId) => {
    try {
      const response = await api.post("/user/orders/pay", {
        stripe_session_id: stripeSessionId,
      });
      return response;
    } catch (error) {
      console.error("Error repaying order:", error);
      throw error;
    }
  },

  // Admin endpoints
  admin: {
    // Lấy tất cả đơn hàng (admin)
    getAllOrders: async (page = 1, perPage = 10, status = "", query = "", sortBy = "newest") => {
      try {
        const params = { page, per_page: perPage };
        if (status) params.status = status;
        if (query) params.query = query;
        if (sortBy) params.sort_by = sortBy;
        const response = await api.get("/admin/orders/get_all", { params });
        return response;
      } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
      }
    },

    getUserOrders: async (userId, page = 1, perPage = 10) => {  
      try {
        const response = await api.get(`/admin/orders/${userId}`, { params: { page, per_page: perPage } });
        return response;
      } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
      }
    },

    // Lấy đơn hàng của user cụ thể
    getOrdersOfUser: async (userId, page = 1, perPage = 10) => {
      try {
        const response = await api.get(`/admin/orders/get_orders_of_user/${userId}`, { 
          params: { page, per_page: perPage } 
        });
        return response;
      } catch (error) {
        console.error("Error fetching orders of user:", error);
        throw error;
      }
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (id, status) => {
      try {
        const response = await api.put(`/user/orders/${id}`, { status });
        return response;
      } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
    },
  },
};

export default OrderService;

