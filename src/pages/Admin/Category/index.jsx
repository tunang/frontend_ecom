import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tags,
  Loader2,
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Search,
  AlertTriangle,
} from "lucide-react";
import CategoryService from "@/services/category.service";
import { toast } from "sonner";
import CategoryForm from "./CategoryForm";
import TrashDialog from "./TrashDialog";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.admin.getCategories(
        currentPage,
        perPage,
        searchQuery
      );
      setCategories(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalCount(response.pagination?.total_count || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const handleTrashRestore = () => {
    // Refresh categories list after restore
    fetchCategories();
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await CategoryService.admin.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      setDeletePopoverOpen(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Không thể xóa danh mục";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý danh mục
            </h1>
            <p className="text-gray-600">Tổng số: {totalCount} danh mục</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setTrashOpen(true)}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Trash2 className="w-4 h-4" />
              Thùng rác
            </Button>
            <Button
              onClick={handleAddNew}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm danh mục
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
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        {/* <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-purple-600" />
            Danh sách danh mục
          </CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <Tags className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "Không tìm thấy danh mục" : "Chưa có danh mục nào"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Thêm danh mục đầu tiên để bắt đầu"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddNew}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm danh mục
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Tên danh mục</TableHead>
                    <TableHead className="font-semibold">Mô tả</TableHead>
                    <TableHead className="font-semibold">Danh mục cha</TableHead>
                    <TableHead className="font-semibold">Danh mục con</TableHead>
                    <TableHead className="text-right font-semibold">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {/* Delete Popover */}
                          <Popover
                            open={deletePopoverOpen === category.id}
                            onOpenChange={(open) =>
                              setDeletePopoverOpen(open ? category.id : null)
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
                                      Bạn có chắc chắn muốn xóa danh mục{" "}
                                      <span className="font-semibold">
                                        "{category.name}"
                                      </span>
                                      ?
                                    </p>
                                    {category.children &&
                                      category.children.length > 0 && (
                                        <p className="text-sm text-red-600 mt-2">
                                          ⚠️ Danh mục này có{" "}
                                          {category.children.length} danh mục con
                                        </p>
                                      )}
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
                                    onClick={() => handleDelete(category.id)}
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

      {/* Category Form Dialog */}
      <CategoryForm
        category={selectedCategory}
        categories={categories}
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {/* Trash Dialog */}
      <TrashDialog
        open={trashOpen}
        onClose={() => setTrashOpen(false)}
        onRestore={handleTrashRestore}
      />
    </div>
  );
};

export default CategoryPage;
