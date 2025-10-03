import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  LogInIcon,
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import CategoryMenu from "@/components/CategoryMenu";
import SearchBar from "@/components/SearchBar";
import MobileNavbar from "../../components/MobileNavbar";

const Header = () => {
  const { user, logout } = useAuthStore();

  const [openPopover, setOpenPopover] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="bg-amber-600 text-white p-3 rounded-xl shadow-md group-hover:bg-amber-700 transition-colors">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
                BookStore
              </span>
              <span className="text-xs text-amber-600 font-medium">
                Thế giới sách trong tầm tay
              </span>
            </div>
          </Link>

          {/* Middle */}
          <div className="flex items-center gap-4 flex-1 max-w-3xl mx-8">
            <CategoryMenu />
            <SearchBar />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <ShoppingBag className="h-6 w-6 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded p-1 cursor-pointer transition-colors" />
            </Link>
            <Popover
              className=""
              open={openPopover}
              onOpenChange={setOpenPopover}
            >
              <PopoverTrigger asChild>
                <User className="h-8 w-8 hidden md:block text-amber-600 hover:cursor-pointer hover:text-amber-700 hover:bg-amber-100 rounded-full p-1" />
              </PopoverTrigger>

              <PopoverContent className="w-fit mt-2 p-3" align="end">
                <div>
                  <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
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
                    <span
                      onClick={() => handleLogout()}
                      className="flex items-center gap-4 text-md hover:text-amber-600"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </span>
                  </nav>
                ) : (
                  <nav className="flex flex-col items-start gap-3">
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
                      className="flex items-center gap-3 text-md hover:text-amber-600"
                    >
                      <span className="ml-[3px]">
                        <UserPlusIcon className="h-4 w-4" />
                      </span>
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
      </div>
    </header>
  );
};

export default Header;
