import { apiBase as api } from "./api";


const AddressService = {
  // Lấy danh sách địa chỉ
  getAddresses: async () => {
    try {
      const response = await api.get("/user/addresses");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      throw error;
    }
  },

  // Lấy chi tiết một địa chỉ
  getAddressById: async (id) => {
    try {
      const response = await api.get(`/user/addresses/${id}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      throw error;
    }
  },

  // Tạo địa chỉ mới
  createAddress: async (data) => {
    try {
      const response = await api.post("/user/addresses", data);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo địa chỉ:", error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, data) => {
    try {
      const response = await api.put(`/user/addresses/${id}`, data);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/user/addresses/${id}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      throw error;
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (id) => {
    try {
      const response = await api.patch(`/user/addresses/${id}/set_default`);
      return response;
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error);
      throw error;
    }
  },
};

export default AddressService;
