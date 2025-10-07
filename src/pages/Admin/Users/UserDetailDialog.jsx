import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  DollarSign,
  Loader2,
  BookOpen,
} from "lucide-react";
import OrderService from "@/services/order.service";
import { toast } from "sonner";

const UserDetailDialog = ({ open, onClose, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (open && user?.id) {
      fetchUserOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders for this specific user using the dedicated endpoint
      const response = await OrderService.admin.getOrdersOfUser(user.id, 1, 100);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Failed to load user orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    if (expandedOrders[orderId]) return;

    try {
      const response = await OrderService.getOrderDetail(orderId);
      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      confirmed: {
        label: "Confirmed",
        className: "bg-blue-100 text-blue-800 border-blue-300",
      },
      processing: {
        label: "Processing",
        className: "bg-purple-100 text-purple-800 border-purple-300",
      },
      shipped: {
        label: "Shipped",
        className: "bg-indigo-100 text-indigo-800 border-indigo-300",
      },
      delivered: {
        label: "Delivered",
        className: "bg-green-100 text-green-800 border-green-300",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-300",
      },
      refunded: {
        label: "Refunded",
        className: "bg-orange-100 text-orange-800 border-orange-300",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (!user) return null;

  return (
    <Dialog className="max-w-max" open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-max max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            User Details
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {user.name} ({user.email})
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Role:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No orders found</p>
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  onValueChange={(value) => {
                    if (value) {
                      fetchOrderDetails(parseInt(value));
                    }
                  }}
                >
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id.toString()}>
                      <AccordionTrigger className="hover:bg-gray-50 px-4 py-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">
                                #{order.order_number}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <p className="font-bold text-green-600">
                              {formatCurrency(order.total_amount)}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-4">
                        {expandedOrders[order.id] ? (
                          <div className="space-y-4 pt-2">
                            {/* Order Items */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3">
                                <Package className="w-4 h-4" />
                                Items ({expandedOrders[order.id].order_items?.length || 0})
                              </h5>
                              <div className="space-y-2">
                                {expandedOrders[order.id].order_items?.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 bg-white p-3 rounded border"
                                  >
                                    {item.book?.cover_image_url ? (
                                      <img
                                        src={`${import.meta.env.VITE_API_IMAGE_URL}${item.book.cover_image_url}`}
                                        alt={item.book.title}
                                        className="w-12 h-16 object-cover rounded border"
                                      />
                                    ) : (
                                      <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {item.book?.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-gray-900">
                                        {formatCurrency(item.total_price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            {expandedOrders[order.id].shipping_address && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                                  <MapPin className="w-4 h-4" />
                                  Shipping Address
                                </h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p className="font-medium">
                                    {expandedOrders[order.id].shipping_address.first_name}{" "}
                                    {expandedOrders[order.id].shipping_address.last_name}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {expandedOrders[order.id].shipping_address.phone}
                                  </p>
                                  <p>{expandedOrders[order.id].shipping_address.address_line_1}</p>
                                  {expandedOrders[order.id].shipping_address.address_line_2 && (
                                    <p>{expandedOrders[order.id].shipping_address.address_line_2}</p>
                                  )}
                                  <p>
                                    {expandedOrders[order.id].shipping_address.city},{" "}
                                    {expandedOrders[order.id].shipping_address.state}{" "}
                                    {expandedOrders[order.id].shipping_address.postal_code}
                                  </p>
                                  <p>{expandedOrders[order.id].shipping_address.country}</p>
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3">
                                <DollarSign className="w-4 h-4" />
                                Order Summary
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Subtotal:</span>
                                  <span className="font-medium">
                                    {formatCurrency(expandedOrders[order.id].subtotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax:</span>
                                  <span className="font-medium">
                                    {formatCurrency(expandedOrders[order.id].tax_amount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Shipping:</span>
                                  <span className="font-medium">
                                    {formatCurrency(expandedOrders[order.id].shipping_cost)}
                                  </span>
                                </div>
                                <div className="border-t border-blue-200 pt-2 flex justify-between">
                                  <span className="font-bold text-gray-900">Total:</span>
                                  <span className="font-bold text-green-600 text-base">
                                    {formatCurrency(expandedOrders[order.id].total_amount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
