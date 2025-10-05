import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2, RotateCcw, Trash2, BookOpen, DollarSign } from "lucide-react";
import BookService from "@/services/book.service";
import { toast } from "sonner";

const TrashDialog = ({ open, onClose, onRestore }) => {
  const [deletedBooks, setDeletedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [restoring, setRestoring] = useState(null);
  const perPage = 10;

  useEffect(() => {
    if (open) {
      fetchDeletedBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPage]);

  const fetchDeletedBooks = async () => {
    try {
      setLoading(true);
      const response = await BookService.admin.getDeletedBooks(
        currentPage,
        perPage
      );
      setDeletedBooks(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching deleted books:", error);
      toast.error("Không thể tải danh sách sách đã xóa");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setRestoring(id);
      await BookService.admin.restoreBook(id);
      toast.success("Khôi phục sách thành công");

      // Refresh deleted list
      await fetchDeletedBooks();

      // Notify parent to refresh main list
      if (onRestore) {
        onRestore();
      }
    } catch (error) {
      console.error("Error restoring book:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Không thể khôi phục sách";
      toast.error(errorMessage);
    } finally {
      setRestoring(null);
    }
  };

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Thùng rác - Sách đã xóa
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Tổng số: {totalCount} sách đã xóa</p>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : deletedBooks.length === 0 ? (
            <div className="text-center py-20">
              <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thùng rác trống</h3>
              <p className="text-gray-600">Không có sách nào đã bị xóa</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold w-[100px]">Ảnh</TableHead>
                    <TableHead className="font-semibold">Tên sách</TableHead>
                    <TableHead className="font-semibold">Giá</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedBooks.map((book) => (
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
                        <span className="font-medium text-gray-900">{book.title}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">{formatCurrency(book.price || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(book.id)}
                          disabled={restoring === book.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {restoring === book.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Đang khôi phục...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Khôi phục
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pt-4 border-t border-gray-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
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
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="w-full">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrashDialog;


