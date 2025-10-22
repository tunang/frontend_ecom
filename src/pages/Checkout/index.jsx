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
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AddressService from "@/services/address.service";
import OrderService from "@/services/order.service";
import SettingService from "@/services/setting.service";
import { useCartStore } from "@/store/useCartStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Cart store
  const { items, selectedItems, getSelectedOrderItems, getSelectedTotal, appliedCoupon, removeAppliedCoupon } = useCartStore();

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Settings
  const [settings, setSettings] = useState({
    tax_rate: 0.1, // default 10%
    shipping_cost: 5, // default $5
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

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
      name: "Stripe",
      description: "Stripe payment",
      icon: CreditCard,
    },
    // {
    //   id: "bank_transfer",
    //   name: "Chuyển khoản ngân hàng",
    //   description: "Chuyển khoản qua Internet Banking",
    //   icon: Truck,
    // },
  ];

  // Order note
  const [orderNote, setOrderNote] = useState("");

  // Get selected cart items for display
  const selectedCartItems = items.filter((item) => 
    selectedItems.includes(item.book.id)
  );

  // Calculate totals
  const shippingFee = parseFloat(settings.shipping_cost);
  const vat = parseFloat(settings.tax_rate);
  const subtotal = getSelectedTotal();
  const taxAmount = subtotal * vat;
  const totalBeforeCoupon = subtotal + shippingFee + taxAmount;
  
  // Calculate coupon discount (applied to total after shipping and tax)
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.percent_off) {
      return (totalBeforeCoupon * appliedCoupon.percent_off) / 100;
    } else if (appliedCoupon.amount_off) {
      return Math.min(parseFloat(appliedCoupon.amount_off), totalBeforeCoupon);
    }
    
    return 0;
  };
  
  const couponDiscount = calculateCouponDiscount();
  const total = totalBeforeCoupon - couponDiscount;

  // Check if cart is empty
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      toast.error("Cart is empty. Please select products.");
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
        toast.error("Cannot load addresses");
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const response = await SettingService.user.getSettings();
        if (response.data) {
          setSettings({
            tax_rate: parseFloat(response.data.tax_rate) || 0.1,
            shipping_cost: parseFloat(response.data.shipping_cost) || 5,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Sử dụng giá trị mặc định nếu lỗi
        toast.error("Không thể tải cài đặt. Sử dụng giá trị mặc định.");
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const validateForm = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
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
        ...(appliedCoupon && { coupon_code: appliedCoupon.code }),
      };

      console.log("Order data:", orderData);

      const response = await OrderService.createOrder(orderData);

      console.log("Order response:", response);

      // Clear applied coupon after successful order
      if (appliedCoupon) {
        removeAppliedCoupon();
      }

      // If payment_url exists, redirect to Stripe payment
      if (response.payment_url) {
        toast.success("Redirecting to payment page...");
        setTimeout(() => {
          window.location.href = response.payment_url;
        }, 500);
      } else {
        // For COD or other non-Stripe payments
        toast.success("Order placed successfully!");
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
            Payment
          </h1>
          <p className="text-gray-600">
            Complete the information to place an order
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
                    Shipping address
                  </div>
                  <Link to="/addresses">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add new address
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
                    <p className="text-gray-500 mb-4">No addresses</p>
                    <Link to="/addresses">
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add new address
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
                                Default
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                           
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Address:</span>{" "}
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
                              <span className="font-medium">Phone:</span> {address.phone_number || address.phone}
                            </p>
                            {address.postal_code && (
                              <p className="text-sm text-gray-600">
                                      <span className="font-medium">Postal code:</span> {address.postal_code}
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
                  <Label htmlFor="orderNote">Order note (optional)</Label>
                  <textarea
                    id="orderNote"
                    rows="3"
                    placeholder="Note for the seller..."
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
                  Payment method
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
                  Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-mono font-semibold text-green-900 text-sm">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-700">
                            {appliedCoupon.percent_off
                              ? `Giảm ${appliedCoupon.percent_off}%`
                              : `Giảm $${parseFloat(appliedCoupon.amount_off).toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeAppliedCoupon}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

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
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping fee</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT ({(vat * 100).toFixed(0)}%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-medium">-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
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
                      Processing...
                    </>
                  ) : (
                    <>
                      Place order
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing an order, you agree to our{" "}
                  <a href="/terms" className="text-amber-600 hover:underline">
                    terms of service
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

