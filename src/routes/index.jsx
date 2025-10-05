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
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminBooksPage from "../pages/Admin/Books";
import CategoryPage from "../pages/Admin/Category";
import AuthorsPage from "../pages/Admin/Authors";
import AdminOrdersPage from "../pages/Admin/Orders";
import AdminUsersPage from "../pages/Admin/Users";
import AdminSettingsPage from "../pages/Admin/Settings";

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
        element: <Cart />,
      },
      {
        path: "/addresses",
        element: <Address />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/checkout/success",
        element: <CheckoutSuccess />,
      },
      {
        path: "/checkout/cancel",
        element: <CheckoutCancel />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "books",
        element: <AdminBooksPage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "authors",
        element: <AuthorsPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
    ],
  },
]);

export default router;
