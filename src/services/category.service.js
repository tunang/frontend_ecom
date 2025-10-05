import { apiBase as api } from "./api";

const CategoryService = {
  // Admin endpoints
  admin: {
    // Lấy danh sách categories (admin)
    getCategories: async (page = 1, perPage = 10, search = "") => {
      try {
        const response = await api.get("/admin/categories", {
          params: { page, per_page: perPage, search },
        });
        return response;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },

    // Tạo category mới
    createCategory: async (data) => {
      try {
        const response = await api.post("/admin/categories", data);
        return response;
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    },

    // Cập nhật category
    updateCategory: async (id, data) => {
      try {
        const response = await api.put(`/admin/categories/${id}`, data);
        return response;
      } catch (error) {
        console.error("Error updating category:", error);
        throw error;
      }
    },

    // Xóa category
    deleteCategory: async (id) => {
      try {
        const response = await api.delete(`/admin/categories/${id}`);
        return response;
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },

    // Lấy danh sách categories đã xóa
    getDeletedCategories: async (page = 1, perPage = 10) => {
      try {
        const response = await api.get("/admin/categories/deleted/list", {
          params: { page, per_page: perPage },
        });
        return response;
      } catch (error) {
        console.error("Error fetching deleted categories:", error);
        throw error;
      }
    },

    // Khôi phục category đã xóa
    restoreCategory: async (id) => {
      try {
        const response = await api.post(`/admin/categories/${id}/restore`);
        return response;
      } catch (error) {
        console.error("Error restoring category:", error);
        throw error;
      }
    },
  },

  // User endpoints
  user: {
    // Lấy danh sách categories (user)
    getCategories: async () => {
      try {
        const response = await api.get("/categories");
        return response;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
  },
};

export default CategoryService;

