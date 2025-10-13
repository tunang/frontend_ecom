import { apiBase as api } from "./api";

const SettingService = {
  admin: {
    getSettings: async () => {
      const response = await api.get("/admin/settings");
      return response;
    },
    updateSettings: async (data) => {
      const response = await api.put("/admin/settings", data);
      return response;
    },
  },
  user: {
    getSettings: async () => {
      const response = await api.get("/user/settings");
      return response;
    },
  },
};

export default SettingService;