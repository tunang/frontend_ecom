import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster
      position="top-center"
      richColors={true}
      toastOptions={{
        duration: 4000,
        style: {
          marginTop: "60px",
          fontSize: "14px",
          fontWeight: "500",
        },
        className: "toast",
      }}
      theme="light"
    />
  </>
);
