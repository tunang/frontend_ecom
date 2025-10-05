import { apiBase as api, apiFormData } from "./api";

const AuthorService = {
  // Admin endpoints
  admin: {
    // Lấy danh sách authors (admin)
    getAuthors: async (page = 1, perPage = 10, search = "") => {
      try {
        const response = await api.get("/admin/authors", {
          params: { page, per_page: perPage, search },
        });
        return response;
      } catch (error) {
        console.error("Error fetching authors:", error);
        throw error;
      }
    },

    // Tạo author mới
    createAuthor: async (data) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.biography) formData.append("biography", data.biography);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (data.birth_date) formData.append("birth_date", data.birth_date);
        if (data.photo) formData.append("photo", data.photo);

        const response = await apiFormData.post("/admin/authors", formData);
        return response;
      } catch (error) {
        console.error("Error creating author:", error);
        throw error;
      }
    },

    // Cập nhật author
    updateAuthor: async (id, data) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.biography) formData.append("biography", data.biography);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (data.birth_date) formData.append("birth_date", data.birth_date);
        if (data.photo) formData.append("photo", data.photo);

        const response = await apiFormData.put(`/admin/authors/${id}`, formData);
        return response;
      } catch (error) {
        console.error("Error updating author:", error);
        throw error;
      }
    },

    // Xóa author
    deleteAuthor: async (id) => {
      try {
        const response = await api.delete(`/admin/authors/${id}`);
        return response;
      } catch (error) {
        console.error("Error deleting author:", error);
        throw error;
      }
    },

    // Lấy danh sách authors đã xóa
    getDeletedAuthors: async (page = 1, perPage = 10) => {
      try {
        const response = await api.get("/admin/authors/deleted/list", {
          params: { page, per_page: perPage },
        });
        return response;
      } catch (error) {
        console.error("Error fetching deleted authors:", error);
        throw error;
      }
    },

    // Khôi phục author đã xóa
    restoreAuthor: async (id) => {
      try {
        const response = await api.post(`/admin/authors/${id}/restore`);
        return response;
      } catch (error) {
        console.error("Error restoring author:", error);
        throw error;
      }
    },
  },
};

export default AuthorService;

