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
    ],
  },
]);

export default router;
