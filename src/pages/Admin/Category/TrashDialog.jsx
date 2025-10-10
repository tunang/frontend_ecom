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
import {
  Loader2,
  RotateCcw,
  Trash2,
  FolderTree,
} from "lucide-react";
import CategoryService from "@/services/category.service";
import { toast } from "sonner";

const TrashDialog = ({ open, onClose, onRestore }) => {
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;

  useEffect(() => {
    if (open) {
      fetchDeletedCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPage]);

  const fetchDeletedCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.admin.getDeletedCategories(
        currentPage,
        perPage
      );
      setDeletedCategories(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching deleted categories:", error);
      toast.error("Cannot load trash list");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setRestoring((prev) => ({ ...prev, [id]: true }));
      await CategoryService.admin.restoreCategory(id);
      toast.success("Restore category successfully");
      fetchDeletedCategories();
      if (onRestore) {
        onRestore();
      }
    } catch (error) {
      console.error("Error restoring category:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Restore category failed";
      toast.error(errorMessage);
    } finally {
      setRestoring((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            Trash ({totalCount})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          ) : deletedCategories.length === 0 ? (
            <div className="text-center py-20 px-6">
              <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trash is empty
              </h3>
              <p className="text-gray-600">
                No category in trash
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Parent</TableHead>
                    <TableHead className="font-semibold">Children</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {category.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {category.parent === null && (
                            <FolderTree className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                            {category.parent.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.children && category.children.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                            {category.children.length} danh mục
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(category.id)}
                          disabled={restoring[category.id]}
                          className="bg-green-600 hover:bg-green-700"
                          title="Restore"
                        >
                          {restoring[category.id] ? (
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
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrashDialog;

