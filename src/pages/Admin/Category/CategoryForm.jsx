import { useState, useEffect } from "react";
import CategoryService from "@/services/category.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, ChevronDown, Search, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CategoryForm = ({ category, categories, open, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [categoriesForSelect, setCategoriesForSelect] = useState([]); 
  const [loadingCategoriesForSelect, setLoadingCategoriesForSelect] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentPopoverOpen, setParentPopoverOpen] = useState(false);
  const [parentSearchQuery, setParentSearchQuery] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
      // Set selected parent if exists
      if (category.parent && categories) {
        const parent = categories.find((cat) => cat.id === category.parent.id);
        setSelectedParent(parent || null);
      } else {
        setSelectedParent(null);
      }
    } else {
      // Reset form when creating new
      setFormData({
        name: "",
        description: "",
      });
      setSelectedParent(null);
    }
    setParentSearchQuery("");
  }, [category, categories]);

  useEffect(() => {
    fetchCategoriesForSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentSearchQuery]);

  const fetchCategoriesForSelect = async () => {
    try {
      setLoadingCategoriesForSelect(true);
      const response = await CategoryService.admin.getCategories(
        1,
        100,
        parentSearchQuery
      );
      setCategoriesForSelect(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoadingCategoriesForSelect(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  //Handle
  const handleSelectParent = (parent) => {
    setSelectedParent(parent);
    setParentPopoverOpen(false);
    setParentSearchQuery("");
  };

  const handleClearParent = () => {
    setSelectedParent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data - convert empty string to null
      const submitData = {
        name: formData.name,
        description: formData.description || null,
        parent_id: selectedParent?.id || null,
      };

      if (category) {
        // Update existing category
        await CategoryService.admin.updateCategory(category.id, submitData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        // Create new category
        await CategoryService.admin.createCategory(submitData);
        toast.success("Thêm danh mục thành công");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        (category
          ? "Không thể cập nhật danh mục"
          : "Không thể thêm danh mục");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out current category and its children from parent options
  // const getParentOptions = () => {
  //   if (!categories) return [];
    
  //   let filtered = [...categories];
    
  //   if (category) {
  //     // When editing, exclude self and own children
  //     filtered = filtered.filter(
  //       (cat) =>
  //         cat.id !== category.id &&
  //         cat.parent?.id !== category.id
  //     );
  //   }

  //   if (parentSearchQuery) {
  //     filtered = filtered.filter((cat) =>
  //       cat.name.toLowerCase().includes(parentSearchQuery.toLowerCase())
  //     );
  //   }
    
  //   return filtered;
  // };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-900">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ví dụ: Fiction, Non-Fiction..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Mô tả ngắn về danh mục..."
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha (Tùy chọn)
            </label>
            <Popover
              open={parentPopoverOpen}
              onOpenChange={setParentPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={parentPopoverOpen}
                  className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
                >
                  {selectedParent ? (
                    <span className="truncate">
                      {selectedParent.name}
                      {selectedParent.parent && (
                        <span className="text-gray-500 text-sm ml-1">
                          (thuộc {selectedParent.parent.name})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      -- Không có danh mục cha --
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {selectedParent && (
                      <X
                        className="h-4 w-4 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearParent();
                        }}
                      />
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start" sideOffset={4}>
                <div className="flex flex-col max-h-[400px]">
                  {/* Search Box */}
                  <div className="p-3 border-b border-gray-200 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={parentSearchQuery}
                        onChange={(e) => setParentSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Category List */}
                  <div 
                    className="overflow-y-auto overscroll-contain scrollbar-thin" 
                    style={{ maxHeight: "300px" }}
                  >
                    {/* No parent option */}
                    <button
                      type="button"
                      onClick={() => handleSelectParent(null)}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between transition-colors",
                        !selectedParent && "bg-purple-50"
                      )}
                    >
                      <span className="text-sm text-gray-600">
                        -- Không có danh mục cha --
                      </span>
                      {!selectedParent && (
                        <Check className="h-4 w-4 text-purple-600" />
                      )}
                    </button>

                    {/* Category options */}
                    {categoriesForSelect.length === 0 ? (
                      <div className="px-3 py-8 text-center text-sm text-gray-500">
                        {parentSearchQuery
                          ? "Không tìm thấy danh mục"
                          : "Không có danh mục khả dụng"}
                      </div>
                    ) : (
                      categoriesForSelect.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => handleSelectParent(cat)}
                          className={cn(
                            "w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between transition-colors",
                            selectedParent?.id === cat.id && "bg-purple-50"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {cat.name}
                            </p>
                            {cat.parent && (
                              <p className="text-xs text-gray-500 truncate">
                                thuộc {cat.parent.name}
                              </p>
                            )}
                          </div>
                          {selectedParent?.id === cat.id && (
                            <Check className="h-4 w-4 text-purple-600 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500 mt-1">
              Chọn danh mục cha nếu đây là danh mục con
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>{category ? "Cập nhật" : "Thêm danh mục"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;

