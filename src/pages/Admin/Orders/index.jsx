import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ShoppingBag,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Search,
} from "lucide-react";
import OrderService from "@/services/order.service";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize from URL params before any state
  const initialStatus = searchParams.get("status") || "all";
  const initialQuery = searchParams.get("query") || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const perPage = 10;

  const statusMap = {
    0: "pending",
    1: "confirmed",
    2: "processing",
    3: "shipped",
    4: "delivered",
    5: "cancelled",
    6: "refunded",
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, searchQuery, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.admin.getAllOrders(
        currentPage,
        perPage,
        statusFilter === "all" ? "" : statusFilter,
        searchQuery,
        sortBy
      );
      setOrders(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Cannot load order list");
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
      console.log(expandedOrders);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Cannot load order details");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      // API accepts string status directly
      await OrderService.admin.updateOrderStatus(orderId, newStatus);
      toast.success("Update status successfully");

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Update expanded order if exists
      if (expandedOrders[orderId]) {
        setExpandedOrders((prev) => ({
          ...prev,
          [orderId]: { ...prev[orderId], status: newStatus },
        }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Cannot update status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    // console.log(status)

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

    const config = statusConfig[status] || statusConfig[0];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Manage orders
            </h1>
            <p className="text-gray-600">Total: {totalCount} orders</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by customer name, email, phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when search
                }}
                className="pl-10"
              />
            </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort:
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
          
          {/* Search Badge */}
          {/* {initialQuery && searchQuery && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg w-fit">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Searching: "{searchQuery}"
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  navigate('/admin/orders');
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          )} */}
        </div>
      </div>

      {/* Orders List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders
              </h3>
              <p className="text-gray-600">
                {statusFilter !== "all"
                  ? "No orders found with this status"
                  : "No orders yet"}
              </p>
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
                  <AccordionTrigger
                    className="hover:bg-gray-50 px-6 py-4  hover:cursor-pointer "
                  >
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-6">
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">
                            {order.order_number}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <div className="text-left">
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium text-gray-900">
                            {order.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.user?.email}
                          </p>
                        </div>

                        <div className="text-left">
                            <p className="text-sm text-gray-600">Total</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-6">
                    {expandedOrders[order.id] ? (
                      <div className="space-y-6 pt-4">
                        {/* Update Status */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update status:
                          </label>
                          <div className="flex items-center gap-3">
                            <Select
                              value={expandedOrders[order.id].status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value)
                              }
                              disabled={updatingStatus === order.id}
                            >
                              <SelectTrigger className="w-[250px] bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  Pending
                                </SelectItem>
                                <SelectItem value="confirmed">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="shipped">
                                  Shipped
                                </SelectItem>
                                <SelectItem value="delivered">
                                  Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                                <SelectItem value="refunded">
                                  Refunded
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {updatingStatus === order.id && (
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Customer Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <User className="w-5 h-5 text-blue-600" />
                              Customer info
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {expandedOrders[order.id].user?.name}
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>
                                  {expandedOrders[order.id].user?.email}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-green-600" />
                              Shipping address
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.first_name
                                }{" "}
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.last_name
                                }
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.phone
                                }
                              </p>
                              <p className="text-gray-600">
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.address_line_1
                                }
                                {expandedOrders[order.id].shipping_address
                                  ?.address_line_2 &&
                                  `, ${
                                    expandedOrders[order.id].shipping_address
                                      ?.address_line_2
                                  }`}
                              </p>
                              <p className="text-gray-600">
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.city
                                }
                                ,{" "}
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.state
                                }{" "}
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.postal_code
                                }
                              </p>
                              <p className="text-gray-600">
                                {
                                  expandedOrders[order.id].shipping_address
                                    ?.country
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Items */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Package className="w-5 h-5 text-amber-600" />
                              Products (
                              {expandedOrders[order.id].order_items?.length})
                            </h3>
                            <div className="space-y-3">
                              {expandedOrders[order.id].order_items?.map(
                                (item) => (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      window.open(
                                        `/books/${
                                          item.book.slug || item.book.id
                                        }`,
                                        "_blank"
                                      );
                                    }}
                                    className="flex items-center gap-4 bg-white p-3 rounded-lg hover:cursor-pointer hover:bg-gray-50 transition-colors"
                                  >
                                    <img
                                      src={`${
                                        import.meta.env.VITE_API_IMAGE_URL
                                      }${item.book.cover_image_url}`}
                                      onError={(e) => {
                                        e.target.src =
                                          "https://placehold.co/150?text=X&font=roboto";
                                      }}
                                      alt={item.book.title}
                                      className="w-16 h-20 object-cover rounded border"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {item.book.title}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Quantity: {item.quantity} x{" "}
                                        {formatCurrency(item.unit_price)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-gray-900">
                                        {formatCurrency(item.total_price)}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-blue-600" />
                              Order summary
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    expandedOrders[order.id].subtotal
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    expandedOrders[order.id].tax_amount
                                  )}
                                </span>
                              </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Shipping fee:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(
                                      expandedOrders[order.id].shipping_cost
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Discount:
                                  </span>
                                  <span className="font-medium text-red-600">
                                    -{formatCurrency(
                                      expandedOrders[order.id].discount_amount
                                    )}
                                  </span>
                                </div>
                              <div className="border-t border-blue-200 pt-2 flex justify-between">
                                <span className="font-bold text-gray-900">
                                  Total:
                                </span>
                                <span className="font-bold text-green-600 text-lg">
                                  {formatCurrency(
                                    expandedOrders[order.id].total_amount
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
