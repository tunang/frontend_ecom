import { create } from "zustand";
import cartService from "../services/cart.service";

const useCartStore = create((set, get) => ({
  items: [],
  selectedItems: [],
  message: null,
  isLoading: false,
  totalItems: 0,
  totalAmount: 0,
  selectedTotalItems: 0,
  selectedTotalAmount: 0,

  getCart: async () => {
    const response = await cartService.getCart();
    console.log("Get cart response:", response);
    set({ items: response.data });
  },

  addToCart: async (data) => {
    set({ isLoading: true });
    try {
      const response = await cartService.addToCart(data);
      console.log("Add to cart response:", response);

      // Get current items from store
      const { items } = get();
      console.log("Current items:", items);

      const existingItem = items.find(
        (item) => item.book.id === response.data.book.id
      );
      console.log("Existing item:", existingItem);

      if (existingItem) {
        const updatedItems = items.map((item) =>
          item.book.id === response.data.book.id
            ? { ...item, quantity: item.quantity + response.data.quantity }
            : item
        );
        console.log("Updated items (existing):", updatedItems);
        set({ items: updatedItems });
      } else {
        const newItems = [...items, response.data];
        console.log("Updated items (new):", newItems);
        set({ items: newItems, message: response.status.message });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      set({ message: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCartItem: async (data) => {
    set({ isLoading: true });
    try {
      const response = await cartService.updateCartItem(data);
      console.log("Update cart item response:", response);

      // Get current items from store
      const { items } = get();
      console.log("Current items:", items);

      const existingItem = items.find(
        (item) => item.book.id === response.data.book.id
      );
      console.log("Existing item:", existingItem);

      if (existingItem) {
        const updatedItems = items.map((item) => {
          console.log("Item:", item);
          if (item.book.id === response.data.book.id) {
            return { ...item, quantity: response.data.quantity };
          }
          return item;
        });
        console.log("Updated items:", updatedItems);
        set({ items: updatedItems, message: response.status.message });
      }
    } catch (error) {
      console.error("Update cart item error:", error);
      set({ message: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (bookId) => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await cartService.removeFromCart(bookId);
      const items = get().items.filter((item) => item.book.id !== bookId);
      set({ items, message: response.status.message });
    } catch (error) {
      console.error("Remove from cart error:", error);
      set({ message: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });
      const response = await cartService.clearCart();
      set({ items: [], message: response.status.message });
    } catch (error) {
      console.error("Clear cart error:", error);
      set({ message: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle select một item
  toggleSelectItem: (bookId) => {
    const { selectedItems } = get();
    const isSelected = selectedItems.includes(bookId);

    if (isSelected) {
      set({ selectedItems: selectedItems.filter((id) => id !== bookId) });
    } else {
      set({ selectedItems: [...selectedItems, bookId] });
    }
  },

  // Select tất cả items
  selectAll: () => {
    const { items } = get();
    const allBookIds = items.map((item) => item.book.id);
    set({ selectedItems: allBookIds });
  },

  // Deselect tất cả items
  deselectAll: () => {
    set({ selectedItems: [] });
  },

  // Check nếu item được selected
  isItemSelected: (bookId) => {
    const { selectedItems } = get();
    return selectedItems.includes(bookId);
  },

  // Lấy order items cho API (chỉ selected items)
  getSelectedOrderItems: () => {
    const { items, selectedItems } = get();
    return items
      .filter((item) => selectedItems.includes(item.book.id))
      .map((item) => ({
        book_id: item.book.id,
        quantity: item.quantity,
      }));
  },

  // Tính tổng cho selected items
  getSelectedTotal: () => {
    const { items, selectedItems } = get();
    return items
      .filter((item) => selectedItems.includes(item.book.id))
      .reduce((total, item) => {
        const price = parseFloat(item.book.price);
        const discount = parseFloat(item.book.discount_percentage || 0);
        const discountedPrice = price * (1 - discount / 100);
        return total + discountedPrice * item.quantity;
      }, 0);
  },
}));

export default useCartStore;
