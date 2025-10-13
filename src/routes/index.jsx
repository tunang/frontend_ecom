import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";
import VerifyMailPage from "../pages/Auth/VerifyMail";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword";
import ResetPasswordPage from "../pages/Auth/ResetPassword";
import BooksPage from "../pages/Books";
import BookDetail from "../pages/BookDetail";
import Cart from "../pages/Cart";
import Address from "../pages/Address";
import CheckoutPage from "../pages/Checkout";
import CheckoutSuccess from "../pages/Checkout/Success";
import CheckoutCancel from "../pages/Checkout/Cancel";
import OrdersPage from "../pages/Orders";
import ProfilePage from "../pages/Profile";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminBooksPage from "../pages/Admin/Books";
import CategoryPage from "../pages/Admin/Category";
import AuthorsPage from "../pages/Admin/Authors";
import AdminOrdersPage from "../pages/Admin/Orders";
import AdminUsersPage from "../pages/Admin/Users";
import AdminSettingsPage from "../pages/Admin/Settings";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/confirm",
        element: <VerifyMailPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset",
        element: <ResetPasswordPage />,
      },
      {
        path: "/books",
        element: <BooksPage />,
      },
      {
        path: "/books/:slug",
        element: <BookDetail />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addresses",
        element: (
          <ProtectedRoute>
            <Address />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/success",
        element: (
          <ProtectedRoute>
            <CheckoutSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/cancel",
        element: (
          <ProtectedRoute>
            <CheckoutCancel />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <AdminDashboard />,
          </ProtectedRoute>
        ),
      },
      {
        path: "books",
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <AdminBooksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <CategoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "authors",
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <AuthorsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <AdminOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
