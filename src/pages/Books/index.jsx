import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BookService from "@/services/book.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ShoppingCartIcon,
  Loader2,
} from "lucide-react";
import BookCard from "../../components/BookCard";
import { toast } from "sonner";
import { useCartStore } from "../../store/useCartStore";

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { message, clearMessage } = useCartStore();
  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [perPage] = useState(12);

  // Categories list (có thể fetch từ API)
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Biography",
    "Romance",
    "Thriller",
    "Mystery",
    "Fantasy",
    "Self-Help",
  ];
  useEffect(() => {
    if (message === "item_added") {
      toast.success("Item added to cart");
      clearMessage();
    }

    if (message === "not_enough_stock") {
      toast.error("Not enough stock");
      clearMessage();
    }
  }, [message]);
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "title_asc", label: "Title: A → Z" },
    { value: "title_desc", label: "Title: Z → A" },
    { value: "newest", label: "Newest" },
  ];

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage,
          per_page: perPage,
        };

        if (searchQuery) params.query = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sortBy) params.sort_by = sortBy;

        const response = await BookService.user.getBooks(params);
        setBooks(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalItems(response.pagination?.total_count || 0);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [
    currentPage,
    perPage,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // Update URL params
  // Sync state với URL params khi searchParams thay đổi (từ navigation bên ngoài)
  useEffect(() => {
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const min = searchParams.get("min_price") || "";
    const max = searchParams.get("max_price") || "";
    const sort = searchParams.get("sort_by") || "";
    const page = parseInt(searchParams.get("page")) || 1;

    setSearchQuery(query);
    setSelectedCategory(category);
    setMinPrice(min);
    setMaxPrice(max);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || minPrice || maxPrice || sortBy;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        {/* <form onSubmit={handleSearch} className="md:hiddenmb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm sách theo tên, tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6"
            >
              Tìm kiếm
            </Button> */}
        <Button
          type="button"
          variant="outline"
          className="md:hidden my-4"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="w-5 h-5" />
        </Button>
        {/* </div>
        </form> */}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showMobileFilters ? "block" : "hidden"
            } md:block w-full md:w-64 flex-shrink-0`}
          >
            <Card className="sticky top-4">
              <CardContent className="p-4 space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Category
                  </Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Price range ($)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      min="0"
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      placeholder="To"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      min="0"
                      className="w-1/2"
                    />
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Sort
                  </Label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Filters applied
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md">
                          "{searchQuery}"
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCategory && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md">
                          {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory("")}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {(minPrice || maxPrice) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md">
                          ${minPrice || "0"} - ${maxPrice || "∞"}
                          <button
                            onClick={() => {
                              setMinPrice("");
                              setMaxPrice("");
                            }}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No products found
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard book={book} />
                  ))}
                </div>

                {/* Pagination Info & Controls */}
                {totalItems > 0 && (
                  <div className="mt-8 space-y-4">
                    {/* Pagination Info */}
                    <div className="text-center text-sm text-gray-600">
                      Displaying{" "}
                      <span className="font-semibold text-gray-900">
                        {(currentPage - 1) * perPage + 1}
                      </span>{" "}
                      -{" "}
                      <span className="font-semibold text-gray-900">
                        {Math.min(currentPage * perPage, totalItems)}
                      </span>{" "}
                      out of{" "}
                      <span className="font-semibold text-gray-900">
                        {totalItems}
                      </span>{" "}
                      products
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>

                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;

                            // Hiển thị trang đầu, cuối và xung quanh trang hiện tại
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
