import { apiBase, apiFormData } from "./api";

/**
 * Lấy danh sách sách với các tham số lọc
 * @param {Object} params - Các tham số query
 * @param {string} params.search - Từ khóa tìm kiếm
 * @param {string} params.category - Danh mục sách
 * @param {number} params.min_price - Giá tối thiểu
 * @param {number} params.max_price - Giá tối đa
 * @param {string} params.sort_by - Sắp xếp (price_asc, price_desc, name_asc, name_desc, etc.)
 * @param {number} params.page - Số trang
 * @param {number} params.per_page - Số item mỗi trang
 * @param {string} params.author - Tên tác giả
 * @param {boolean} params.in_stock - Còn hàng hay không
 * @param {boolean} params.featured - Sách nổi bật hay không
 * @returns {Promise} Danh sách sách
 */

const BookService = {
  admin: {
    // Lấy danh sách sách (admin)
    getBooks: async (params = {}) => {
      try {
        const response = await apiBase.get("/user/books", { params });
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        throw error;
      }
    },

    // Tạo sách mới
    createBook: async (data) => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("stock_quantity", data.stock_quantity);
        formData.append("featured", data.featured ? "true" : "false");
        formData.append("sold_count", data.sold_count || 0);
        formData.append("cost_price", data.cost_price);
        formData.append("discount_percentage", data.discount_percentage || 0);
        
        if (data.cover_image) formData.append("cover_image", data.cover_image);
        
        if (data.sample_pages && data.sample_pages.length > 0) {
          data.sample_pages.forEach((file) => {
            formData.append("sample_pages[]", file);
          });
        }
        
        if (data.author_ids && data.author_ids.length > 0) {
          data.author_ids.forEach((id) => {
            formData.append("author_ids[]", id);
          });
        }
        
        if (data.category_ids && data.category_ids.length > 0) {
          data.category_ids.forEach((id) => {
            formData.append("category_ids[]", id);
          });
        }

        const response = await apiFormData.post("/admin/books", formData);
        return response;
      } catch (error) {
        console.error("Error creating book:", error);
        throw error;
      }
    },

    // Cập nhật sách
    updateBook: async (id, data) => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("stock_quantity", data.stock_quantity);
        formData.append("featured", data.featured ? "true" : "false");
        formData.append("sold_count", data.sold_count || 0);
        formData.append("cost_price", data.cost_price);
        formData.append("discount_percentage", data.discount_percentage || 0);
        
        if (data.cover_image) formData.append("cover_image", data.cover_image);
        
        if (data.sample_pages && data.sample_pages.length > 0) {
          data.sample_pages.forEach((file) => {
            formData.append("sample_pages[]", file);
          });
        }
        
        if (data.author_ids && data.author_ids.length > 0) {
          data.author_ids.forEach((id) => {
            formData.append("author_ids[]", id);
          });
        }
        
        if (data.category_ids && data.category_ids.length > 0) {
          data.category_ids.forEach((id) => {
            formData.append("category_ids[]", id);
          });
        }

        const response = await apiFormData.patch(`/admin/books/${id}`, formData);
        return response;
      } catch (error) {
        console.error("Error updating book:", error);
        throw error;
      }
    },

    // Xóa sách
    deleteBook: async (id) => {
      try {
        const response = await api.delete(`/admin/books/${id}`);
        return response;
      } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
      }
    },
  },

  user: {
    getBooks: async (params = {}) => {
      try {
        const response = await apiBase.get("/user/books", { params });
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        throw error;
      }
    },

    getBookBySlug: async (slug) => {
      try {
        const response = await apiBase.get(`/user/books/${slug}`);
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
        throw error;
      }
    },

    getNestedCategories: async () => {
      try {
        const response = await apiBase.get("/user/categories/get_nested_category");
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục nested:", error);
        throw error;
      }
    },
  },
};

export default BookService;
