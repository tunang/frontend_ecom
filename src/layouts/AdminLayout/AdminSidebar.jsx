import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  UserPen,
  ShoppingBag,
  Users,
  Settings,
  ChevronRight,
  Home,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = ({ onLinkClick }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const menuItems = [
    {
      to: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      exact: true,
    },
    {
      to: "/admin/books",
      icon: BookOpen,
      label: "Sách",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      to: "/admin/categories",
      icon: Tags,
      label: "Danh mục",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      to: "/admin/authors",
      icon: UserPen,
      label: "Tác giả",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      to: "/admin/orders",
      icon: ShoppingBag,
      label: "Đơn hàng",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      to: "/admin/users",
      icon: Users,
      label: "Người dùng",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      to: "/admin/settings",
      icon: Settings,
      label: "Cài đặt",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Admin Panel</h2>
            <p className="text-xs text-amber-100">Quản lý hệ thống</p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" onClick={handleLinkClick}>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all group border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="h-4 w-4 text-amber-600" />
              </div>
              <span className="font-medium text-gray-700 text-sm">
                Về trang chủ
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link key={item.to} to={item.to} onClick={handleLinkClick}>
              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all group border-2",
                  active
                    ? "bg-amber-50 border-amber-200 shadow-md"
                    : "bg-white border-gray-100 hover:bg-amber-50 hover:border-amber-200 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-transform",
                      item.bgColor,
                      active ? "scale-110" : "group-hover:scale-110"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      active ? "text-amber-900" : "text-gray-700"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    "h-5 w-5 transition-all",
                    active
                      ? "text-amber-600 translate-x-1"
                      : "text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1"
                  )}
                />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          <p className="font-medium">BookStore Admin</p>
          <p className="text-gray-400 mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

