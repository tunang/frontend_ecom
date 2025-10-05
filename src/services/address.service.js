import { apiBase as api } from "./api";

const AddressService = {
  // Lấy danh sách địa chỉ
  getAddresses: async () => {
    try {
      const response = await api.get("/user/addresses");
      return response;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  },

  // Tạo địa chỉ mới
  createAddress: async (data) => {
    try {
      const response = await api.post("/user/addresses", data);
      return response;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, data) => {
    try {
      const response = await api.put(`/user/addresses/${id}`, data);
      return response;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/user/addresses/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  },
};

export default AddressService;
