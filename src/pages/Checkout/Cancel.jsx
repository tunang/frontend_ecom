import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, ShoppingBag, HelpCircle } from "lucide-react";

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg border-0 overflow-hidden">
          {/* Cancel Icon */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4 shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment cancelled
            </h1>
            <p className="text-gray-600">
              Your order has not been completed
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What happened?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bạn đã hủy quá trình thanh toán hoặc quá trình thanh toán đã bị gián đoạn.
                    Đơn hàng của bạn chưa được xác nhận và không có khoản thanh toán nào được thực hiện.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">You can:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Thử lại thanh toán</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      The product is still in your cart
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Tiếp tục mua sắm</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Explore more products and come back later
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/cart" className="flex-1">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Back to cart
                </Button>
              </Link>
              <Link to="/books" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue shopping
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Having trouble with payment?
              </p>
              <Link to="/support" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                Contact support →
              </Link>
            </div>

            {/* Common Issues */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Common issues:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Payment card has insufficient balance</li>
                <li>• Payment card information is incorrect</li>
                <li>• Payment session expired</li>
                <li>• Internet connection interrupted</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutCancel;

