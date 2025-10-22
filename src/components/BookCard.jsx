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
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

const BookCard = ({book}) => {
  const { addToCart, message } = useCartStore(); 
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = async (book) => {
    if (!user) {
      toast.error("Please login to add to cart", {
        duration: 3000,
      });
      return;
    }
    
    await addToCart({
      book_id: book.id,
      quantity: quantity,
    });
  };

  

  return (
    <Card
      key={book.id}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group py-0"
    >
      <CardContent className="p-0">
        <Link to={`/books/${book.slug || book.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}${
                book.cover_image_url
              }`}
              onError={(e) => {
                e.target.src = "https://placehold.co/150?text=X&font=roboto";
              }}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {book.discount_percentage > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                -{book.discount_percentage}%
              </div>
            )}
          </div>
        </Link>
        <div className="p-4 space-y-2">
          <Link to={`/books/${book.slug || book.id}`}>
            <h3 className="font-semibold text-base line-clamp-1 hover:text-amber-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          {book.authors && book.authors.length > 0 && (
            <p className="text-sm text-gray-600 line-clamp-1">
              {book.authors.map((author) => author.name).join(", ")}
            </p>
          )}
          <div className="flex items-center gap-2">
            {book.discount_percentage > 0 ? (
              <>
                <span className="text-lg font-bold text-amber-600">
                  $
                  {(book.price * (1 - book.discount_percentage / 100)).toFixed(
                    2
                  )}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${parseFloat(book.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-amber-600">
                ${parseFloat(book.price).toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={() => handleAddToCart(book)} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer">
            <ShoppingCartIcon className="w-4 h-4" />
            Add
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
