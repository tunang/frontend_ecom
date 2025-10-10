import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Register Schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number"),
    password_confirmation: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password not match",
    path: ["password_confirmation"],
  });

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

// Reset Password Schema (for API request)
export const resetPasswordSchema = z
  .object({
    reset_password_token: z.string(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number"),
    confirmation_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "Password not match",
    path: ["confirmation_password"],
  });

// Reset Password Form Schema (for form validation only - without token)
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number"),
    confirmation_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "Password not match",
    path: ["confirmation_password"],
  });

// Change Password Schema
export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Current password is required"),
    password: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .regex(/[0-9]/, "New password must contain at least 1 number"),
    password_confirmation: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password not match",
    path: ["password_confirmation"],
  });
