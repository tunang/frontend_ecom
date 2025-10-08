import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import StatService from "@/services/stat.service";
import { subscribeAdminOrdersChannel } from "../../../lib/cable/admin/order/cable";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalOutOfStock: 0,
    totalUsers: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
  });

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
      }

      if (data.type === "ORDER_PROCESSING") {
        toast.success("An order was processing!");

        setStats((prev) => ({
          ...prev,
          pendingOrders: Math.max(prev.pendingOrders - 1, 0),
          confirmedOrders: prev.confirmedOrders + 1,
        }));
      }

      // Add more cases if needed
    };

    return () => {
      channel.unsubscribe();
    };
  }, []);

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

  const statsCards = [
    {
      title: "Total books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Out of stock",
      value: stats.totalOutOfStock,
      icon: Package,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Pending orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Confirmed orders",
      value: stats.confirmedOrders,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Delivered orders",
      value: stats.deliveredOrders,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
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
            className="hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100"
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
                  <div className="flex items-center gap-1 min-h-5" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Recent orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card className="border-2 border-gray-100">
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
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
