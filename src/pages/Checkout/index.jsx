import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Truck,
  MapPin,
  Wallet,
  Check,
  ChevronRight,
  Package,
  Loader2,
  Plus,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import AddressService from "@/services/address.service";
import OrderService from "@/services/order.service";
import { useCartStore } from "@/store/useCartStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Cart store
  const { items, selectedItems, getSelectedOrderItems, getSelectedTotal } = useCartStore();

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Payment Methods
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const paymentMethods = [
    // {
    //   id: "cod",
    //   name: "Thanh toán khi nhận hàng (COD)",
    //   description: "Thanh toán bằng tiền mặt khi nhận hàng",
    //   icon: Wallet,
    // },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua Internet Banking",
      icon: Truck,
    },
  ];

  // Order note
  const [orderNote, setOrderNote] = useState("");

  // Get selected cart items for display
  const selectedCartItems = items.filter((item) => 
    selectedItems.includes(item.book.id)
  );

  // Calculate totals
  const shippingFee = 2.5;
  const subtotal = getSelectedTotal();
  const total = subtotal + shippingFee;

  // Check if cart is empty
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      toast.error("Giỏ hàng trống. Vui lòng chọn sản phẩm.");
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    }
  }, [selectedCartItems, navigate]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await AddressService.getAddresses();
        setAddresses(response.data || []);
        console.log(response.data)
        
        // Auto select default address or first address
        const defaultAddress = response.data?.find((addr) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (response.data && response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Không thể tải danh sách địa chỉ");
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const validateForm = () => {
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setIsProcessing(true);

      const orderData = {
        shipping_address_id: selectedAddressId,
        payment_method: selectedPayment,
        note: orderNote || undefined,
        order_items: getSelectedOrderItems(),
      };

      console.log("Order data:", orderData);

      const response = await OrderService.createOrder(orderData);

      console.log("Order response:", response);

      // If payment_url exists, redirect to Stripe payment
      if (response.payment_url) {
        toast.success("Chuyển đến trang thanh toán...");
        setTimeout(() => {
          window.location.href = response.payment_url;
        }, 500);
      } else {
        // For COD or other non-Stripe payments
        toast.success("Đặt hàng thành công!");
        setTimeout(() => {
          if (response.data?.id) {
            navigate(`/orders/${response.data.id}`);
          } else {
            navigate("/orders");
          }
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0] || "Đặt hàng thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
      console.error("Order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán
          </h1>
          <p className="text-gray-600">
            Hoàn tất thông tin để đặt hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    Địa chỉ giao hàng
                  </div>
                  <Link to="/addresses">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Thêm địa chỉ mới
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Chưa có địa chỉ nào</p>
                    <Link to="/addresses">
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm địa chỉ mới
                      </Button>
                    </Link>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-amber-600 bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {address.first_name} {address.last_name}
                            </h4>
                            {address.is_default && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                           
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Địa chỉ:</span>{" "}
                              {[
                                address.address_line || address.street_address || address.address,
                                address.ward || address.ward_name,
                                address.district || address.district_name,
                                address.city || address.province || address.city_name,
                                address.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">SĐT:</span> {address.phone_number || address.phone}
                            </p>
                            {address.postal_code && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Mã bưu điện:</span> {address.postal_code}
                              </p>
                            )}
                          </div>
                        </div>
                        {selectedAddressId === address.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Order Note */}
                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="orderNote">Ghi chú đơn hàng (Tùy chọn)</Label>
                  <textarea
                    id="orderNote"
                    rows="3"
                    placeholder="Ghi chú cho người bán..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-600" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-amber-600 bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPayment === method.id
                            ? "bg-amber-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {method.description}
                        </p>
                      </div>
                      {selectedPayment === method.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedCartItems.map((item) => {
                    const book = item.book;
                    const price = parseFloat(book.price);
                    const discount = parseFloat(book.discount_percentage || 0);
                    const discountedPrice = price * (1 - discount / 100);
                    
                    return (
                      <div key={book.id} className="flex gap-3">
                        <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_URL}${book.cover_image_url}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                          <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-bl">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {book.title}
                          </h4>
                          <p className="text-sm text-amber-600 font-semibold mt-1">
                            ${discountedPrice.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-md transition-colors duration-200"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đặt hàng
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <a href="/terms" className="text-amber-600 hover:underline">
                    điều khoản dịch vụ
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

