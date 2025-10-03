import { apiBase } from "./api";

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
    getBooks: async (params) => {
      try {
        const response = await api.get("/user/books", { params });
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
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
