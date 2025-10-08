import { apiBase as api } from "./api";

const UserService = {
  admin: {
    // Lấy danh sách users (admin)
    getUsers: async (page = 1, perPage = 10, search = "") => {
      try {
        const response = await api.get("/admin/users", {
          params: { page, per_page: perPage, search },
        });
        return response;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    // Tạo user mới
    createUser: async (data) => {
      try {
        const response = await api.post("/admin/users", {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || "user",
        });
        return response;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    // Cập nhật user
    updateUser: async (id, data) => {
      try {
        const payload = {
          name: data.name,
          email: data.email,
          role: data.role || "user",
        };
        // Only include password if provided
        if (data.password) {
          payload.password = data.password;
        }
        const response = await api.put(`/admin/users/${id}`, payload);
        return response;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    // Xóa user
    deleteUser: async (id) => {
      try {
        const response = await api.delete(`/admin/users/${id}`);
        return response;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    // Lấy danh sách users đã xóa
    getDeletedUsers: async (page = 1, perPage = 10) => {
      try {
        const response = await api.get("/admin/users/deleted/list", {
          params: { page, per_page: perPage },
        });
        return response;
      } catch (error) {
        console.error("Error fetching deleted users:", error);
        throw error;
      }
    },

    // Khôi phục user đã xóa
    restoreUser: async (id) => {
      try {
        const response = await api.post(`/admin/users/${id}/restore`);
        return response;
      } catch (error) {
        console.error("Error restoring user:", error);
        throw error;
      }
    },
  },
};

export default UserService;


