import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading/verification
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Có thể gọi API để verify session_id hoặc cập nhật order status
    if (sessionId) {
      console.log("Stripe session ID:", sessionId);
      // TODO: Call API to verify payment and update order
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg border-0 overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Order Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                    </p>
                    <p>
                      Đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc.
                    </p>
                    {sessionId && (
                      <p className="text-xs mt-2 text-gray-500">
                        Session ID: {sessionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Bước tiếp theo:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <span>Bạn sẽ nhận được email xác nhận đơn hàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <span>Đơn hàng sẽ được đóng gói và vận chuyển</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <span>Bạn có thể theo dõi tình trạng đơn hàng trong tài khoản</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/orders" className="flex-1">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Xem đơn hàng của tôi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/books" className="flex-1">
                <Button variant="outline" className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Cần hỗ trợ?{" "}
                <Link to="/support" className="text-amber-600 hover:text-amber-700 font-medium">
                  Liên hệ chúng tôi
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

