import axios from "axios";

// Tạo axios instance với cấu hình cơ bản
const apiBase = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request Interceptor - Tự động thêm accessToken vào header
apiBase.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    
    // Nếu có accessToken, thêm vào Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    // Xử lý lỗi request
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và lỗi
apiBase.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp
    return response.data;
  },
  (error) => {
    // Xử lý các lỗi phổ biến
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Token hết hạn hoặc không hợp lệ
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          // Có thể redirect về trang login
          // window.location.href = "/login";
          break;
          
        case 403:
          // Forbidden - Không có quyền truy cập
          console.error("Bạn không có quyền truy cập tài nguyên này");
          break;
          
        case 404:
          // Not Found
          console.error("Không tìm thấy tài nguyên");
          break;
          
        case 500:
          // Internal Server Error
          console.error("Lỗi máy chủ, vui lòng thử lại sau");
          break;
          
        default:
          console.error("Đã xảy ra lỗi:", error.response.data?.message || error.message);
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Không thể kết nối đến máy chủ");
    } else {
      // Lỗi khác
      console.error("Đã xảy ra lỗi:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// Tạo axios instance cho FormData (upload file/image)
const apiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 30000, // Timeout dài hơn cho upload file
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request Interceptor cho FormData API
apiFormData.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    
    // Nếu có accessToken, thêm vào Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor cho FormData API
apiFormData.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tương tự như api thông thường
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // window.location.href = "/login";
          break;
          
        case 403:
          console.error("Bạn không có quyền truy cập tài nguyên này");
          break;
          
        case 413:
          // Payload Too Large - File quá lớn
          console.error("File upload quá lớn");
          break;
          
        case 500:
          console.error("Lỗi máy chủ, vui lòng thử lại sau");
          break;
          
        default:
          console.error("Đã xảy ra lỗi:", error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error("Không thể kết nối đến máy chủ");
    } else {
      console.error("Đã xảy ra lỗi:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function để upload một file
export const uploadFile = async (endpoint, file, fieldName = "file") => {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  return await apiFormData.post(endpoint, formData);
};

// Helper function để upload nhiều file
export const uploadMultipleFiles = async (endpoint, files, fieldName = "files") => {
  const formData = new FormData();
  
  // Nếu files là array
  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
  } else {
    // Nếu files là FileList
    for (let i = 0; i < files.length; i++) {
      formData.append(fieldName, files[i]);
    }
  }
  
  return await apiFormData.post(endpoint, formData);
};

// Helper function để upload file kèm data khác
export const uploadFileWithData = async (endpoint, file, data, fieldName = "file") => {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  // Thêm các field khác vào formData
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  
  return await apiFormData.post(endpoint, formData);
};

// Helper function để upload image với preview
export const uploadImage = async (endpoint, imageFile, fieldName = "image") => {
  // Validate file type
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validImageTypes.includes(imageFile.type)) {
    throw new Error("File không phải là hình ảnh hợp lệ");
  }
  
  return await uploadFile(endpoint, imageFile, fieldName);
};

export { apiFormData, apiBase };

