import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import StatService from "@/services/stat.service";
import OrderService from "@/services/order.service";
import { subscribeAdminOrdersChannel } from "../../../lib/cable/admin/order/cable";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalOutOfStock: 0,
    totalUsers: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchRecentOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const response = await OrderService.admin.getAllOrders(1, 5, "", "", "newest");
      setRecentOrders(response.data || []);
    } catch (error) {
      console.error("Error loading recent orders:", error);
      toast.error("Failed to load recent orders");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    const channel = subscribeAdminOrdersChannel();

    channel.received = (data) => {
      console.log("Order event received:", data);

      if (data.type === "ORDER_CREATED") {
        toast.success("New order received!");

        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          pendingOrders: prev.pendingOrders + 1,
        }));


        // Refresh recent orders list
        fetchRecentOrders();
      }

      if (data.type === "ORDER_PROCESSING") {
        toast.success("An order was processing!");

        setStats((prev) => ({
          ...prev,
          pendingOrders: Math.max(prev.pendingOrders - 1, 0),
          confirmedOrders: prev.confirmedOrders + 1,
        }));

        // Refresh recent orders list
        fetchRecentOrders();
      }

      // Add more cases if needed
    };

    return () => {
      channel.unsubscribe();
    };
  }, [fetchRecentOrders]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await StatService.admin.getStats();
        const data = response.data || {};
        setStats({
          totalBooks: data.total_books || 0,
          totalOrders: data.total_orders || 0,
          totalOutOfStock: data.total_out_of_stock_books || 0,
          totalUsers: data.total_users || 0,
          pendingOrders: data.pending_orders || 0,
          confirmedOrders: data.confirmed_orders || 0,
          deliveredOrders: data.delivered_orders || 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        toast.error("Failed to load statistics");
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRecentOrders();
  }, [fetchRecentOrders]);

  const handleStatCardClick = (navigateTo) => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const statsCards = [
    {
      title: "Total books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      clickable: true,
      navigateTo: "/admin/books",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
      clickable: true,
      navigateTo: "/admin/orders?status=all",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      clickable: true,
      navigateTo: "/admin/users",
    },
    {
      title: "Out of stock",
      value: stats.totalOutOfStock,
      icon: Package,
      color: "text-red-600",
      bgColor: "bg-red-50",
      clickable: true,
      navigateTo: "/admin/books?in_stock=false",
    },
    {
      title: "Pending orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      clickable: true,
      navigateTo: "/admin/orders?status=pending",
    },
    {
      title: "Confirmed orders",
      value: stats.confirmedOrders,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-purple-50",
      clickable: true,
      navigateTo: "/admin/orders?status=confirmed",
    },
    {
      title: "Delivered orders",
      value: stats.deliveredOrders,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      clickable: true,
      navigateTo: "/admin/orders?status=delivered",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">System overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={`hover:shadow-lg transition-all duration-300 border-2 border-gray-100 ${
              stat.clickable ? "cursor-pointer hover:scale-105" : ""
            }`}
            onClick={() => stat.clickable && handleStatCardClick(stat.navigateTo)}
          >
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 min-h-5">
                    {stat.clickable && (
                      <span className="text-xs text-gray-500">Click to view</span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Recent Orders */}
        <Card className="border-2 border-gray-100 gap-0 py-0">
          <CardHeader className="  border-b border-gray-100 bg-gray-50">
            <CardTitle className="h-full text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Recent orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders?query=${order.order_number}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {order.user?.name || "Unknown user"}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "confirmed"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-sm font-bold text-gray-900 mt-1.5">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Books */}
        {/* <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Featured books
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Coming soon</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default DashboardPage;
