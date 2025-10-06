import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/Schemas/auth.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });



  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await AuthService.forgotPassword(data);

      if (response?.status?.message === "reset_email_sent") {
        setSentEmail(data.email);
        setEmailSent(true);
        toast.success("Email reset password has been sent!", {
          duration: 5000,
        });
      }

  
    } catch (error) {
      const errorData = error.response?.data;
      const errorMsg = errorData?.status?.message;

      if (errorMsg === "email_not_found") {
        const errors = errorData?.errors || [];
        toast.error(errors[0] || "Email not found in the system.", {
          duration: 5000,
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu đã gửi email thành công, hiển thị màn hình xác nhận
  if (emailSent) {
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
                  Check your email
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <Mail className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700">
                    We have sent the reset password link to
                  </p>
                  <p className="text-sm font-semibold text-amber-600 mt-1">
                    {sentEmail}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Please check your email and click the link to reset your password.
                  The link will expire in 24 hours.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs text-gray-600">
                    💡 <strong>Tip:</strong> If you don't see the email, please check your spam or junk folder.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setSentEmail("");
                    }}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 rounded-md transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Send again with a different email
                  </Button>

                  <Link to="/login">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200">
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
            Forgot password?
          </h1>
          <p className="text-gray-600">
            Enter your email to receive the reset password link
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-gray-600">
                  You will receive an email containing the reset password link. The link will expire in 24 hours.
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
                      Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

