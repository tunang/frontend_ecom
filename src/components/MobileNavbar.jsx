import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  User, 
  LogIn, 
  UserPlus, 
  ShoppingBag, 
  MapPin, 
  Shield, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileNavbar = () => {
  const { user, logout } = useAuthStore();
  const [openSheet, setOpenSheet] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setOpenSheet(false);
  };

  const handleLogout = () => {
    logout();
    setOpenSheet(false);
    navigate("/");
  };

  const menuItems = user
    ? [
        { to: "/profile", icon: User, label: "Tài khoản", color: "text-blue-600", bgColor: "bg-blue-50" },
        { to: "/orders", icon: ShoppingBag, label: "Đơn hàng", color: "text-green-600", bgColor: "bg-green-50" },
        { to: "/addresses", icon: MapPin, label: "Địa chỉ", color: "text-purple-600", bgColor: "bg-purple-50" },
        { to: "/admin", icon: Shield, label: "Quản trị", color: "text-red-600", bgColor: "bg-red-50" },
      ]
    : [];

  return (
    <div className="md:hidden">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-amber-50">
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-amber-600 p-6 text-white">
              {user ? (
                <div className="flex items-center gap-3">
                
                  <div>
                    <p className="font-semibold text-lg">{user.name || "Người dùng"}</p>
                    <p className="text-sm text-amber-100">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Xin chào!</p>
                    <p className="text-sm text-amber-100">Đăng nhập để tiếp tục</p>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {user ? (
                <>
                  {menuItems.map((item) => {
                    // Ẩn menu Admin nếu user không phải admin
                    if (item.to === "/admin" && user?.role !== "admin") {
                      return null;
                    }
                    
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={handleLinkClick}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-amber-50 transition-all  hover:shadow-md group border-2 border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <span className="font-medium text-gray-800">{item.label}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleLinkClick} className="block">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-amber-50 transition-all shadow-sm hover:shadow-md group border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogIn className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">Đăng nhập</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>

                  <Link to="/register" onClick={handleLinkClick} className="block">
                    <div className="flex items-center justify-between p-4 bg-amber-600 rounded-xl hover:bg-amber-700 transition-all shadow-md hover:shadow-lg group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-white">Đăng ký ngay</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Footer - Logout */}
            {user && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <button onClick={handleLogout} className="block w-full">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all group border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LogOut className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="font-medium text-red-700">Đăng xuất</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;