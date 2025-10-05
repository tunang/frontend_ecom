import { apiBase as api } from "./api";

const StatService = {
  admin: {
    getStats: async () => {
      try {
        const response = await api.get("/admin/stat");
        return response;
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
      }
    },
  },
};

export default StatService;


