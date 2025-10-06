import { Link, useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  LogInIcon,
  User,
  UserPlusIcon,
  ShoppingBag,
  LogOutIcon,
  MapPinCheck,
  Settings,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import CategoryMenu from "@/components/CategoryMenu";
import SearchBar from "@/components/SearchBar";
import MobileNavbar from "../../components/MobileNavbar";
import CartUtils from "../../util/CartUtils";
import { useCartStore } from "../../store/useCartStore";
const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState(false);
  
  // Close popover when a link is clicked
  const handleClose = () => setOpenPopover(false);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group flex-shrink-0">
            <div className="bg-amber-600 text-white p-2 sm:p-3 rounded-xl shadow-md group-hover:bg-amber-700 transition-colors">
              <BookOpenIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
                Sahafa
              </span>
              {/* <span className="text-xs text-amber-600 font-medium hidden md:block">
                The world of books in your hand
              </span> */}
            </div>
          </Link>

          {/* Middle - Desktop/Tablet Only */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-3xl mx-8">
            <CategoryMenu />
            <SearchBar />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/cart" className="flex-shrink-0 relative">
              <ShoppingBag className="h-6 w-6 sm:h-6 sm:w-6 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded cursor-pointer transition-colors" />
              {items.length > 0 && (
                <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {CartUtils.getCartTotalQuantity(items)}
                  </span>
              )}
            </Link>
            
            {/* Desktop User Menu */}
            <Popover
              open={openPopover}
              onOpenChange={setOpenPopover}
            >
              <PopoverTrigger asChild>
                <User className="h-7 w-7 sm:h-8 sm:w-8 hidden md:block text-amber-600 hover:cursor-pointer hover:text-amber-700 hover:bg-amber-100 rounded-full p-1" />
              </PopoverTrigger>

              <PopoverContent className="w-fit mt-2 p-3" align="end">
                {user ? (
                  <nav className="flex flex-col items-start gap-3 p-2">
                    <Link
                      to="/profile"
                      onClick={handleClose}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={handleClose}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={handleClose}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <MapPinCheck className="h-4 w-4" />
                      <span>Address</span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={handleClose}
                        className="flex items-center gap-4 text-md hover:text-amber-600"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-md hover:text-amber-600 w-full text-left"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </nav>
                ) : (
                  <nav className="flex flex-col items-start gap-3 p-2">
                    <Link
                      to="/login"
                      onClick={handleClose}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <LogInIcon className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={handleClose}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      <span>Register</span>
                    </Link>
                  </nav>
                )}
              </PopoverContent>
            </Popover>

            {/* Mobile nav with Sheet */}
            <MobileNavbar />
          </div>
        </div>

        {/* Mobile Search Bar - Below main header */}
        <div className="lg:hidden pb-3 pt-2">
          <div className="flex items-center gap-2">
            <CategoryMenu />
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;