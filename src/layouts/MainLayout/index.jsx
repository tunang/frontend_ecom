import { Link, Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  LogInIcon,
  Menu,
  User,
  UserPlusIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import Header from "./Header";
import TestStore from "../../components/TestStore";
const MainLayout = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-background mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 BookStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
