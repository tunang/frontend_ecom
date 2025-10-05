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
  User,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Calendar,
  Globe,
} from "lucide-react";
import AuthorService from "@/services/author.service";
import { toast } from "sonner";
import AuthorForm from "./AuthorForm";
import TrashDialog from "./TrashDialog";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [trashDialogOpen, setTrashDialogOpen] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await AuthorService.admin.getAuthors(
        currentPage,
        perPage,
        searchQuery
      );
      setAuthors(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching authors:", error);
      toast.error("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedAuthor(null);
    setFormOpen(true);
  };

  const handleEdit = (author) => {
    setSelectedAuthor(author);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAuthor(null);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedAuthor(null);
    fetchAuthors();
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await AuthorService.admin.deleteAuthor(id);
      toast.success("Delete author successfully");
      setDeletePopoverOpen(null);
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Failed to delete author";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage authors
            </h1>
            <p className="text-gray-600">Total: {totalCount} authors</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setTrashDialogOpen(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Trash
            </Button>
            <Button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add author
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
            placeholder="Search author..."
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
          ) : authors.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No author found" : "No author yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try searching with a different keyword"
                  : "Add the first author to start"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddNew}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add author
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold w-[80px]">ID</TableHead>
                      <TableHead className="font-semibold w-[100px]">Image</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semobold">Nationality</TableHead>
                    <TableHead className="font-semobold">Birth date</TableHead>
                    <TableHead className="font-semobold">Biography</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
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
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(author)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {/* Delete Popover */}
                          <Popover
                            open={deletePopoverOpen === author.id}
                            onOpenChange={(open) =>
                              setDeletePopoverOpen(open ? author.id : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-50 hover:text-red-600"
                                title="Delete"
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
                                      Confirm delete
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Are you sure you want to delete the author{" "}
                                      <span className="font-semibold">
                                        "{author.name}"
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
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleDelete(author.id)}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                  >
                                    {deleting ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      "Delete"
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

      {/* Author Form Dialog */}
      <AuthorForm
        author={selectedAuthor}
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {/* Trash Dialog */}
      <TrashDialog
        open={trashDialogOpen}
        onClose={() => setTrashDialogOpen(false)}
        onRestore={fetchAuthors}
      />
    </div>
  );
};

export default AuthorsPage;

