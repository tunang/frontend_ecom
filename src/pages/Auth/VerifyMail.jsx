import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";

const VerifyMailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const confirmationToken = searchParams.get("confirmation_token");

      if (!confirmationToken) {
        setStatus("error");
        setErrorMessage("Token xác thực không hợp lệ.");
        toast.error("Liên kết xác thực không hợp lệ.", {
          duration: 5000,
        });
        return;
      }

      try {
        const response = await AuthService.verifyEmail(confirmationToken);

        if (response?.status?.message === "email_confirmed") {
          setStatus("success");
          toast.success("Email đã được xác thực thành công!", {
            duration: 5000,
          });

          // Redirect về trang login sau 3 giây
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        const errorData = error.response?.data;
        const errorMsg = errorData?.status?.message;

        setStatus("error");

        if (errorMsg === "email_confirmed_failed") {
          const errors = errorData?.errors || [];
          setErrorMessage(errors[0] || "Email đã được xác thực trước đó.");
          toast.error("Email đã được xác thực. Vui lòng đăng nhập.", {
            duration: 5000,
          });
        } else {
          setErrorMessage("Xác thực email thất bại. Vui lòng thử lại.");
          toast.error("Xác thực email thất bại.", {
            duration: 5000,
          });
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardContent className="pt-8 px-6 pb-6">
            <div className="text-center space-y-4">
              {/* Loading State */}
              {status === "loading" && (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-2">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Đang xác thực email...
                  </h2>
                  <p className="text-sm text-gray-600">
                    Vui lòng đợi trong giây lát
                  </p>
                </>
              )}

              {/* Success State */}
              {status === "success" && (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Xác thực thành công!
                  </h2>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <Mail className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">
                      Email của bạn đã được xác thực thành công.
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
                  >
                    Đăng nhập ngay
                  </Button>
                </>
              )}

              {/* Error State */}
              {status === "error" && (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Xác thực thất bại
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
                    >
                      Đến trang đăng nhập
                    </Button>
                    <Button
                      onClick={() => navigate("/register")}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 rounded-md transition-colors duration-200"
                    >
                      Đăng ký tài khoản mới
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyMailPage;

