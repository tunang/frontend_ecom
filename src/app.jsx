import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { initUser } = useAuthStore();

  useEffect(() => {
    // Khởi tạo user khi app load
    initUser();
  }, [initUser]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;