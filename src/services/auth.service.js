import { apiBase as api } from "./api";

const AuthService = {
  login: async (data) => {
    const response = await api.post("/login", data);
    return response;
  },
  register: async (data) => {
    const response = await api.post("/register", data);
    return response;
  },
  resendVerificationEmail: async (data) => {
    const response = await api.post("/confirmation", data);
    return response;
  },
  verifyEmail: async (confirmationToken) => {
    const response = await api.get(`/confirmation?confirmation_token=${confirmationToken}`);
    return response;
  },
  forgotPassword: async (data) => {
    const response = await api.post("/forgot", data);
    return response;
  },
  resetPassword: async (data) => {
    const response = await api.post("/reset", data);
    return response;
  },
};

export default AuthService;