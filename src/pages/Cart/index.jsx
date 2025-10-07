import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartService from "@/services/cart.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import TestStore from "../../components/TestStore";

const Cart = () => {
  const {
    items,
    selectedItems,
    getCart,
    updateCartItem,
    toggleSelectItem,
    selectAll,
    deselectAll,
    getSelectedTotal,
    getSelectedOrderItems,
    isLoading,
    message,
    removeFromCart,
    clearCart,
    clearMessage,
  } = useCartStore();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [openPopovers, setOpenPopovers] = useState({});

  useEffect(() => {
    getCart();
  }, []);



  const handleUpdateQuantity = async (bookId, newQuantity, stockQuantity) => {
    // if (newQuantity < 1 || newQuantity > stockQuantity) {
    //   toast.error(`Số lượng phải từ 1 đến ${stockQuantity}`);
    //   return;
    // }

    await updateCartItem({
      book_id: bookId,
      quantity: newQuantity,
    });
  };

  const handleRemoveItem = async (bookId, bookTitle) => {
    console.log("Removing item:", bookId);
    await removeFromCart(bookId);
    setOpenPopovers((prev) => ({ ...prev, [bookId]: false }));
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearDialog(false);
  };

  const calculateItemPrice = (item) => {
    const price = parseFloat(item.book.price);
    const discount = parseFloat(item.book.discount_percentage || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * item.quantity;
  };

  // Chỉ tính cho selected items
  const calculateTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.book.id))
      .reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const calculateSubtotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.book.id))
      .reduce(
        (total, item) => total + parseFloat(item.book.price) * item.quantity,
        0
      );
  };

  const calculateTotalDiscount = () => {
    return calculateSubtotal() - calculateTotal();
  };

  // Check if all items are selected
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    
    // Log order items format for debugging
    console.log("Order items:", getSelectedOrderItems());
    navigate("/checkout");
  };

  useEffect(() => {
    if (message === "item_updated") {
      toast.success("Item updated");
      clearMessage();
    }

    if (message === "item_removed") {
      toast.success("Item removed");
      clearMessage();
    }

  }, [message]);


  if (items.length === 0) {
    return (

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-500 mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <Button
                onClick={() => navigate("/books")}
                className="bg-amber-600 hover:bg-amber-700 hover:cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Giỏ hàng ({items.length} sản phẩm)
            </h1>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Đã chọn {selectedItems.length} sản phẩm
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowClearDialog(true)}
            className="text-red-600 border-red-600 hover:bg-red-50 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <Card>
              <CardContent className="">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900">
                    Select all ({items.length} items)
                  </span>
                </label>
              </CardContent>
            </Card>
            {items.map((item) => {
              const book = item.book;
              const discountedPrice =
                parseFloat(book.price) *
                (1 - parseFloat(book.discount_percentage || 0) / 100);
              const isUpdating = updatingItems.has(book.id);

              const isSelected = selectedItems.includes(book.id);

              return (
                <Card key={book.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(book.id)}
                          className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>

                      {/* Image */}
                      <Link
                        to={`/books/${book.slug || book.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              `${import.meta.env.VITE_API_IMAGE_URL}${
                                book.cover_image_url
                              }`
                            }
                            alt={book.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/150?text=X&font=roboto";
                            }}
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${book.slug || book.id}`}>
                          <h3 className="font-semibold text-lg text-gray-900 hover:text-amber-600 line-clamp-2 mb-1">
                            {book.title}
                          </h3>
                        </Link>

                        {book.authors && book.authors.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            {book.authors.map((a) => a.name).join(", ")}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-bold text-amber-600">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {book.discount_percentage > 0 && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ${parseFloat(book.price).toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                -{book.discount_percentage}%
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(
                                  book.id,
                                  item.quantity - 1,
                                  book.stock_quantity
                                )
                              }
                              disabled={item.quantity <= 1 || isUpdating}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(
                                  book.id,
                                  item.quantity + 1,
                                  book.stock_quantity
                                )
                              }
                              disabled={
                                item.quantity >= book.stock_quantity || isUpdating
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-gray-500 ml-2">
                              (Còn {book.stock_quantity})
                            </span>
                          </div>

                          <Popover
                            open={openPopovers[book.id] || false}
                            onOpenChange={(open) =>
                              setOpenPopovers((prev) => ({
                                ...prev,
                                [book.id]: open,
                              }))
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    Xác nhận xóa
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Bạn có chắc chắn muốn xóa "{book.title}" khỏi giỏ
                                    hàng?
                                  </p>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setOpenPopovers((prev) => ({
                                        ...prev,
                                        [book.id]: false,
                                      }))
                                    }
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleRemoveItem(book.id, book.title)
                                    }
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${calculateItemPrice(item).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Total order
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {calculateTotalDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${calculateTotalDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-amber-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                >
                  Checkout ({selectedItems.length})
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                {selectedItems.length === 0 && (
                  <p className="text-xs text-center text-red-500 mt-2">
                    Please select at least one item
                  </p>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate("/books")}
                >
                  Continue shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Clear Cart Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa tất cả sản phẩm</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
              >
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleClearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Cart;
