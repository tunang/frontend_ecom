import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordFormSchema } from "@/Schemas/auth.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();

  const resetToken = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmation_password: "",
    },
  });

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!resetToken) {
      setTokenError(true);
      toast.error("Reset password link is invalid.", {
        duration: 5000,
      });
    }
  }, [resetToken]);

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("Token is invalid.", { duration: 3000 });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        reset_password_token: resetToken,
        password: data.password,
        confirmation_password: data.confirmation_password,
      };

      const response = await AuthService.resetPassword(payload);

      if (response?.status?.message === "password_successfully_reset") {
        setResetSuccess(true);
        toast.success("Password has been reset successfully!", {
          duration: 5000,
        });

        // Redirect về login sau 3 giây
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      const errorData = error.response?.data;
      const errorMsg = errorData?.status?.message;

      if (errorMsg === "invalid_reset_token" || errorMsg === "reset_token_expired") {
        toast.error("Reset password link is invalid or expired.", {
          duration: 5000,
        });
        setTokenError(true);
      } else {
        const errors = errorData?.errors || [];
        toast.error(errors[0] || "Reset password failed. Please try again.", {
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu reset thành công
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-8 px-6 pb-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Password reset successful!
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <Lock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700">
                    Your password has been updated.
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  You will be redirected to the login page after 3 seconds...
                </p>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
                >
                  Login now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Nếu token không hợp lệ
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-8 px-6 pb-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Invalid link
                </h2>

                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-700">
                    Reset password link is invalid or expired.
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                    Please request a new link to reset your password.
                </p>

                <div className="space-y-3 pt-4">
                  <Link to="/forgot-password">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200">
                      Request new link
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 rounded-md transition-colors duration-200"
                    >
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset password
          </h1>
          <p className="text-gray-600">
            Enter your new password
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters and contain at least 1 number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmation_password">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmation_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmation_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmation_password && (
                  <p className="text-sm text-red-500">
                    {errors.confirmation_password.message}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-gray-600">
                  🔒 After resetting your password, you will need to login with your new password.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

