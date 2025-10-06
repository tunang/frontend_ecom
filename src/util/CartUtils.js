import { useCartStore } from "@/store/useCartStore";

const CartUtils = {
  getCartTotalQuantity: (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotalPrice: (items) => {
    return items.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  },
};

export default CartUtils;
