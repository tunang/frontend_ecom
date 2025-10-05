import { apiBase as api } from "./api";

const UserService = {
  admin: {
    // Lấy danh sách users (admin) - chỉ xem
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
  },
};

export default UserService;


