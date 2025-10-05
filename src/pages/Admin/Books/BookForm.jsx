import { useState, useEffect } from "react";
import BookService from "@/services/book.service";
import AuthorService from "@/services/author.service";
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
import { Loader2, Upload, X, Image as ImageIcon, Plus, Search } from "lucide-react";
import { toast } from "sonner";

const BookForm = ({ book, open, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    featured: false,
    sold_count: "",
    cost_price: "",
    discount_percentage: "",
    author_ids: [],
    category_ids: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [samplePages, setSamplePages] = useState([]);
  const [samplePreviews, setSamplePreviews] = useState([]);
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchAuthorsAndCategories();
    }
  }, [open]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        description: book.description || "",
        price: book.price || "",
        stock_quantity: book.stock_quantity || "",
        featured: book.featured || false,
        sold_count: book.sold_count || "",
        cost_price: book.cost_price || "",
        discount_percentage: book.discount_percentage || "",
        author_ids: book.authors?.map(author => author.id) || [],
        category_ids: book.categories?.map(category => category.id) || [],
      });
      
      // Set existing images
      if (book.cover_image_url) {
        setCoverPreview(`${import.meta.env.VITE_API_IMAGE_URL}${book.cover_image_url}`);
      }
      if (book.sample_page_urls) {
        setSamplePreviews(book.sample_page_urls.map(url => 
          `${import.meta.env.VITE_API_IMAGE_URL}${url}`
        ));
      }
    } else {
      // Reset form when creating new
      setFormData({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        featured: false,
        sold_count: "",
        cost_price: "",
        discount_percentage: "",
        author_ids: [],
        category_ids: [],
      });
      setCoverImage(null);
      setCoverPreview(null);
      setSamplePages([]);
      setSamplePreviews([]);
    }
  }, [book]);

  const fetchAuthorsAndCategories = async () => {
    try {
      setLoadingData(true);
      const [authorsRes, categoriesRes] = await Promise.all([
        AuthorService.admin.getAuthors(1, 100),
        CategoryService.admin.getCategories(1, 100)
      ]);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSamplePagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSamplePages(files);
    const readers = files.map(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSamplePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
      return reader;
    });
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleRemoveSamplePage = (index) => {
    setSamplePages(prev => prev.filter((_, i) => i !== index));
    setSamplePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAuthorToggle = (authorId) => {
    setFormData(prev => ({
      ...prev,
      author_ids: prev.author_ids.includes(authorId)
        ? prev.author_ids.filter(id => id !== authorId)
        : [...prev.author_ids, authorId]
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        cover_image: coverImage,
        sample_pages: samplePages,
      };

      if (book) {
        console.log(submitData);
        await BookService.admin.updateBook(book.id, submitData);
        toast.success("Update book successfully");
      } else {
        await BookService.admin.createBook(submitData);
        toast.success("Add book successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving book:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        (book ? "Failed to update book" : "Failed to add book");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">
            {book ? "Edit book" : "Add book"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter description"
            />
          </div>

          {/* Stock & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock quantity
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost price
              </label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount percentage
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sold count
              </label>
              <input
                type="number"
                name="sold_count"
                value={formData.sold_count}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Sách nổi bật
              </label>
            </div>
          </div>

          {/* Authors Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {formData.author_ids.length > 0 
                    ? `${formData.author_ids.length} authors selected`
                    : "Select author"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-3 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={authorSearch}
                      onChange={(e) => setAuthorSearch(e.target.value)}
                      placeholder="Search author..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto overscroll-contain scrollbar-thin px-3 pb-3">
                    {loadingData ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredAuthors.map((author) => (
                          <label
                            key={author.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.author_ids.includes(author.id)}
                              onChange={() => handleAuthorToggle(author.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm">{author.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Categories Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {formData.category_ids.length > 0 
                    ? `${formData.category_ids.length} categories selected`
                    : "Select category"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-3 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search category..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto overscroll-contain scrollbar-thin px-3 pb-3">
                    {loadingData ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredCategories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.category_ids.includes(category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover image
            </label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-32 h-40 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="cover_image"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="cover_image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF (Max 5MB)
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Sample Pages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample pages
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="sample_pages"
                accept="image/*"
                multiple
                onChange={handleSamplePagesChange}
                className="hidden"
              />
              <label
                htmlFor="sample_pages"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload sample pages
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (Max 5MB per file)
                </p>
              </label>
            </div>
            
            {samplePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {samplePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSamplePage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                <>{book ? "Update" : "Add book"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
