import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes";
import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";

const App = () => {
  const { initUser } = useAuthStore();
  const {getCart} = useCartStore();
  useEffect(() => {
    // Khởi tạo user khi app load
    initUser();
    getCart();
  }, [initUser]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;