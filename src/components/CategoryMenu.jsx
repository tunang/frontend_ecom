import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BookService from "@/services/book.service";

const CategoryMenu = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await BookService.user.getNestedCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && categories.length === 0) {
      fetchCategories();
    }
  }, [open]);

  const handleSelectCategory = (category) => {
    navigate(`/books?category=${category.name}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-screen max-h-[80vh] overflow-y-auto p-0" 
        align="start"
        sideOffset={8}
      >
        {loading ? (
          <div className="text-center py-6 text-gray-500">Đang tải...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-2">
                {/* Parent Category */}
                <h3
                  className="font-semibold text-gray-800 cursor-pointer hover:text-amber-600"
                  onClick={() => handleSelectCategory(cat)}
                >
                  {cat.name}
                </h3>
                {/* Children */}
                {cat.children && cat.children.length > 0 && (
                  <ul className="space-y-1 pl-2">
                    {cat.children.map((child) => (
                      <li
                        key={child.id}
                        className="text-sm text-gray-600 cursor-pointer hover:text-amber-600"
                        onClick={() => handleSelectCategory(child)}
                      >
                        {child.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Không có danh mục
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CategoryMenu;