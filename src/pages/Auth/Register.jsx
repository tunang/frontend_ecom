import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/Schemas/auth.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isRegisted, setIsRegisted] = useState(false);
  const navigate = useNavigate();

  // Zustand store
  const { register: registerUser, isLoading, message, clearErrors } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Clear errors khi component unmount
  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  // Xử lý message từ store
  useEffect(() => {
    if (message === "user_created_successfully") {
      const email = getValues("email");
      setRegisteredEmail(email);
      setCountdown(30);
      setIsRegisted(true);
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.", { 
        duration: 5000 
      });
    }

    if (message === "user_creation_failed") {
      setIsRegisted(false);
      toast.error("Đăng ký thất bại! Email đã tồn tại. Vui lòng thử lại.", { 
        duration: 5000 
      });
    }
  }, [message, getValues]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    
    if (!result.success) {
      // Error đã được xử lý trong useEffect
      return;
    }
  };

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const response = await AuthService.resendVerificationEmail({ email: registeredEmail });
      
      // Xử lý response message
      if (response?.status?.message === "confirmation_email_sent") {
        setCountdown(30);
        toast.success("Email đã được gửi lại. Vui lòng kiểm tra hộp thư.", { 
          duration: 5000 
        });
      }
    } catch (error) {
      // Xử lý error message
      const errorMessage = error.response?.data?.status?.message;
      
      if (errorMessage === "confirmation_email_failed") {
        toast.error("Email đã được xác thực. Vui lòng đăng nhập.", { 
          duration: 5000 
        });
      } else {
        toast.error("Không thể gửi lại email. Vui lòng thử lại sau.", {
          duration: 3000,
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  // Nếu đã đăng ký thành công, hiển thị màn hình xác nhận email
  if (registeredEmail) {
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
                  Xác nhận email của bạn
                </h2>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <Mail className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700">
                    Chúng tôi đã gửi email xác nhận đến
                  </p>
                  <p className="text-sm font-semibold text-amber-600 mt-1">
                    {registeredEmail}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác nhận để kích hoạt tài khoản.
                </p>

                <div className="pt-4">
                  <Button
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isResending}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang gửi...
                      </>
                    ) : countdown > 0 ? (
                      `Gửi lại email (${countdown}s)`
                    ) : (
                      "Gửi lại email xác nhận"
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Đã xác nhận email?{" "}
                    <Link
                      to="/login"
                      className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
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
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600">
            Đăng ký để bắt đầu mua sắm sách yêu thích
          </p>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
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
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password_confirmation")}
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
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-tight"
                >
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Chính sách bảo mật
                  </Link>
                </label>
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
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
