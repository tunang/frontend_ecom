import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Star,
  DollarSign,
  Package,
} from "lucide-react";
import BookService from "@/services/book.service";
import { toast } from "sonner";
import BookForm from "./BookForm";

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        search: searchQuery,
      };
      const response = await BookService.admin.getBooks(
        params
      );
      setBooks(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Không thể tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedBook(null);
    setFormOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedBook(null);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedBook(null);
    fetchBooks();
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await BookService.admin.deleteBook(id);
      toast.success("Xóa sách thành công");
      setDeletePopoverOpen(null);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Không thể xóa sách";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const discount = (parseFloat(price) * parseFloat(discountPercentage)) / 100;
    return parseFloat(price) - discount;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý sách
            </h1>
            <p className="text-gray-600">Tổng số: {totalCount} sách</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm sách
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm sách..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "Không tìm thấy sách" : "Chưa có sách nào"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Thêm sách đầu tiên để bắt đầu"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddNew}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sách
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold w-[100px]">Ảnh</TableHead>
                    <TableHead className="font-semibold">Tên sách</TableHead>
                    <TableHead className="font-semibold">Tác giả</TableHead>
                    <TableHead className="font-semibold">Danh mục</TableHead>
                    <TableHead className="font-semibold">Giá</TableHead>
                    <TableHead className="font-semibold">Tồn kho</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{book.id}</TableCell>
                      <TableCell>
                        {book.cover_image_url ? (
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_URL}${book.cover_image_url}`}
                            alt={book.title}
                            className="w-12 h-16 rounded object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-16 rounded bg-gray-100 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {book.title}
                          </span>
                          {book.featured && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-yellow-600">Nổi bật</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {book.authors?.map(author => author.name).join(", ") || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {book.categories?.map(category => category.name).join(", ") || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">
                              {formatCurrency(book.price)}
                            </span>
                          </div>
                          {book.discount_percentage > 0 && (
                            <div className="text-xs text-green-600">
                              Giảm {book.discount_percentage}% = {formatCurrency(
                                calculateDiscountedPrice(book.price, book.discount_percentage)
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="w-3 h-3 text-gray-400" />
                          <span>{book.stock_quantity || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            book.stock_quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(book)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {/* Delete Popover */}
                          <Popover
                            open={deletePopoverOpen === book.id}
                            onOpenChange={(open) =>
                              setDeletePopoverOpen(open ? book.id : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-50 hover:text-red-600"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                      Xác nhận xóa
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Bạn có chắc chắn muốn xóa sách{" "}
                                      <span className="font-semibold">
                                        "{book.title}"
                                      </span>
                                      ?
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDeletePopoverOpen(null)}
                                    disabled={deleting}
                                    className="flex-1"
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleDelete(book.id)}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                  >
                                    {deleting ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Đang xóa...
                                      </>
                                    ) : (
                                      "Xóa"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
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
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
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
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Book Form Dialog */}
      <BookForm
        book={selectedBook}
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AdminBooksPage;