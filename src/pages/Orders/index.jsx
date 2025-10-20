import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Package,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import OrderService from "@/services/order.service";
import { toast } from "sonner";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [processingRepay, setProcessingRepay] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;

  // Fetch orders list
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await OrderService.getOrders({
          page: currentPage,
          per_page: perPage,
        });
        setOrders(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalCount(response.pagination?.total_count || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Cannot load order list");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  // Fetch order detail when accordion opens
  const fetchOrderDetail = async (orderId) => {
    if (orderDetails[orderId]) return; // Already fetched

    try {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));
      const response = await OrderService.getOrderDetail(orderId);
      setOrderDetails((prev) => ({
        ...prev,
        [orderId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Cannot load order detail");
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Handle repay order
  const handleRepay = async (order) => {
    if (!order.stripe_session_id) {
      toast.error("Cannot repay this order");
      return;
    }

    try {
      setProcessingRepay((prev) => ({ ...prev, [order.id]: true }));
      const response = await OrderService.repayOrder(order.stripe_session_id);

      if (response.data?.payment_url) {
        toast.success("Redirecting to payment page...");
        setTimeout(() => {
          window.location.href = response.data.payment_url;
        }, 500);
      } else {
        toast.error("Cannot get payment link");
      }
    } catch (error) {
      console.error("Error repaying order:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        "Cannot repay. Please try again.";
      toast.error(errorMessage);
    } finally {
      setProcessingRepay((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      confirmed: {
        label: "Paid",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      processing: {
        label: "Processing",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      shipped: {
        label: "Shipping",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      delivered: {
        label: "Delivered",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My orders
          </h1>
          <p className="text-gray-600">
            {totalCount > 0
              ? `You have ${totalCount} orders`
              : "No orders yet"}
          </p>
        </div>

        {/* Loading */}
        {loadingOrders ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <Card className="text-center py-20">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Explore and shop now!
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Shop now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Orders Accordion */}
            <Card className="py-0">
              <CardContent className="py-0 ">
                <Accordion
                  type="single"
                  collapsible
                  className="hover:cursor-pointer"
                  onValueChange={(value) => {
                    if (value) {
                      fetchOrderDetail(parseInt(value));
                    }
                  }}
                >
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id.toString()}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <Package className="w-5 h-5 text-amber-600" />
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">
                                {order.order_number}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-amber-600">
                                ${parseFloat(order.total_amount).toFixed(2)}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        {loadingDetails[order.id] ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                          </div>
                        ) : orderDetails[order.id] ? (
                          <div className="space-y-6 pt-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Products
                              </h4>
                              <div className="space-y-3">
                                {orderDetails[order.id].order_items?.map(
                                  (item) => (
                                    <div
                                      onClick={() => {
                                        window.open(`/books/${item.book.slug}`, '_blank');
                                      }}
                                      key={item.id}
                                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                        <img
                                          src={`${
                                            import.meta.env.VITE_API_IMAGE_URL
                                          }${item.book.cover_image_url}`}
                                          alt={item.book.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://via.placeholder.com/150";
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">
                                          {item.book.title}
                                        </h5>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm text-amber-600 font-semibold mt-1">
                                          ${parseFloat(item.unit_price).toFixed(
                                            2
                                          )}{" "}
                                          x {item.quantity} = $
                                          {parseFloat(item.total_price).toFixed(
                                            2
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Shipping address
                              </h4>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">
                                  {
                                    orderDetails[order.id].shipping_address
                                      .first_name
                                  }{" "}
                                  {
                                    orderDetails[order.id].shipping_address
                                      .last_name
                                  }
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {
                                    orderDetails[order.id].shipping_address
                                      .phone
                                  }
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {[
                                    orderDetails[order.id].shipping_address
                                      .address_line_1,
                                    orderDetails[order.id].shipping_address
                                      .address_line_2,
                                    orderDetails[order.id].shipping_address
                                      .city,
                                    orderDetails[order.id].shipping_address
                                      .state,
                                    orderDetails[order.id].shipping_address
                                      .postal_code,
                                    orderDetails[order.id].shipping_address
                                      .country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Payment details
                              </h4>
                              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Subtotal
                                  </span>
                                  <span className="font-medium">
                                    $
                                    {parseFloat(
                                      orderDetails[order.id].subtotal
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Tax</span>
                                  <span className="font-medium">
                                    $
                                    {parseFloat(
                                      orderDetails[order.id].tax_amount
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Shipping fee
                                  </span>
                                  <span className="font-medium">
                                    $
                                    {parseFloat(
                                      orderDetails[order.id].shipping_cost
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                
                                <div className="border-t pt-2 flex justify-between">
                                  <span className="font-semibold text-gray-900">
                                      Total
                                  </span>
                                  <span className="font-bold text-amber-600 text-lg">
                                    $
                                    {parseFloat(
                                      orderDetails[order.id].total_amount
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action buttons */}
                            {order.status === "pending" && (
                              <div className="flex flex-col gap-3 pt-4">
                                {/* Repay button - only show if order has stripe_session_id */}
                                  <Button
                                    className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
                                    onClick={() => handleRepay(orderDetails[order.id])}
                                    disabled={processingRepay[order.id]}
                                  >
                                    {processingRepay[order.id] ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <CreditCard className="w-4 h-4" />
                                        Pay now
                                      </>
                                    )}
                                  </Button>
                                
                                {/* <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                      // TODO: Cancel order
                                      toast.info("This feature is under development");
                                    }}
                                  >
                                    Cancel order
                                  </Button>
                                  <Button className="flex-1 bg-gray-600 hover:bg-gray-700">
                                    Contact support
                                  </Button>
                                </div> */}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

