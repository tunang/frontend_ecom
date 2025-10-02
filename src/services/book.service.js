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

    /**
     * Lấy chi tiết một cuốn sách theo ID
     * @param {string|number} bookId - ID của sách
     * @returns {Promise} Thông tin chi tiết sách
     */
    getBookById: async (bookId) => {
      try {
        const response = await api.get(`/user/books/${bookId}`);
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
        throw error;
      }
    },

    /**
     * Lấy danh sách danh mục sách
     * @returns {Promise} Danh sách danh mục
     */
    getCategories: async () => {
      try {
        const response = await api.get("/user/categories");
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        throw error;
      }
    },

    /**
     * Lấy danh sách tác giả
     * @returns {Promise} Danh sách tác giả
     */
    getAuthors: async () => {
      try {
        const response = await api.get("/user/authors");
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tác giả:", error);
        throw error;
      }
    },

    /**
     * Lấy sách nổi bật
     * @param {number} limit - Số lượng sách (mặc định: 10)
     * @returns {Promise} Danh sách sách nổi bật
     */
    getFeaturedBooks: async (limit = 10) => {
      try {
        const response = await api.get("/user/books", {
          params: {
            featured: true,
            per_page: limit,
          },
        });
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy sách nổi bật:", error);
        throw error;
      }
    },

    /**
     * Lấy sách mới nhất
     * @param {number} limit - Số lượng sách (mặc định: 10)
     * @returns {Promise} Danh sách sách mới nhất
     */
    getNewBooks: async (limit = 10) => {
      try {
        const response = await api.get("/user/books", {
          params: {
            sort_by: "created_at_desc",
            per_page: limit,
          },
        });
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy sách mới nhất:", error);
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
  },
};

export default BookService;
