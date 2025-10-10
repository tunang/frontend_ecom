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
import { Loader2, RotateCcw, Trash2, User, Calendar, Globe } from "lucide-react";
import AuthorService from "@/services/author.service";
import { toast } from "sonner";

const TrashDialog = ({ open, onClose, onRestore }) => {
  const [deletedAuthors, setDeletedAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [restoring, setRestoring] = useState(null);
  const perPage = 10;

  useEffect(() => {
    if (open) {
      fetchDeletedAuthors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPage]);

  const fetchDeletedAuthors = async () => {
    try {
      setLoading(true);
      const response = await AuthorService.admin.getDeletedAuthors(
        currentPage,
        perPage
      );
      setDeletedAuthors(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching deleted authors:", error);
      toast.error("Cannot load trash list");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setRestoring(id);
      await AuthorService.admin.restoreAuthor(id);
      toast.success("Restore author successfully");
      
      // Refresh deleted list
      await fetchDeletedAuthors();
      
      // Notify parent to refresh main list
      if (onRestore) {
        onRestore();
      }
    } catch (error) {
      console.error("Error restoring author:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Restore author failed";
      toast.error(errorMessage);
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Trash - Author deleted
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Total: {totalCount} authors deleted
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : deletedAuthors.length === 0 ? (
            <div className="text-center py-20">
              <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trash is empty
              </h3>
              <p className="text-gray-600">
                No author in trash
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold w-[100px]">Image</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Nationality</TableHead>
                    <TableHead className="font-semibold">Birth date</TableHead>
                    <TableHead className="font-semibold">Biography</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedAuthors.map((author) => (
                    <TableRow key={author.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{author.id}</TableCell>
                      <TableCell>
                        {author.photo ? (
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_URL}${author.photo}`}
                            alt={author.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {author.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {author.nationality ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span>{author.nationality}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {author.birth_date ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(author.birth_date)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {author.biography || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(author.id)}
                          disabled={restoring === author.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {restoring === author.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
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

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrashDialog;

