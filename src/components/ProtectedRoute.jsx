import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useAuthStore();

  // Đang loading, hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu cần
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập và có quyền, render children
  return children;
};

export default ProtectedRoute;
