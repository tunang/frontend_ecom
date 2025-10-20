import { apiBase as api } from "./api";

const CouponService = {
  // Admin endpoints
  admin: {
    // Lấy danh sách coupons
    getCoupons: async (page = 1, perPage = 10, search = "") => {
      try {
        const response = await api.get("/admin/coupons", {
          params: { page, per_page: perPage, search },
        });
        return response;
      } catch (error) {
        console.error("Error fetching coupons:", error);
        throw error;
      }
    },

    // Tạo coupon mới
    createCoupon: async (data) => {
      try {
        const response = await api.post("/admin/coupons", data);
        return response;
      } catch (error) {
        console.error("Error creating coupon:", error);
        throw error;
      }
    },

    // Cập nhật trạng thái active của coupon
    updateCoupon: async (id, data) => {
      try {
        const response = await api.put(`/admin/coupons/${id}`, data);
        return response;
      } catch (error) {
        console.error("Error updating coupon:", error);
        throw error;
      }
    },
  },

  // User endpoints
  user: {
    // Validate coupon code
    validateCoupon: async (code) => {
      try {
        const response = await api.get("/user/coupon/validate", {
          params: { code },
        });
        return response;
      } catch (error) {
        console.error("Error validating coupon:", error);
        throw error;
      }
    },
  },
};

export default CouponService;
