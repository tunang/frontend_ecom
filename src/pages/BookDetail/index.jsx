import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BookService from "@/services/book.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Tag,
  PackageCheck,
  PackageX,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import TestStore from "../../components/TestStore";

const BookDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { addToCart, message, clearMessage } = useCartStore();

  useEffect(() => {
    const fetchBookDetail = async () => {
      setIsLoading(true);
      try {
        const response = await BookService.user.getBookBySlug(slug);
        setBook(response.data);

        // Set default selected image
        if (response.data?.cover_image_url) {
          setSelectedImage(response.data.cover_image_url);
        }
      } catch (error) {
        console.error("Error loading book detail: ", error);
        toast.error("Cannot load book detail");
        navigate("/books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    // TODO: Implement add to cart logic
    await addToCart({
      book_id: book.id,
      quantity: quantity,
    });
    clearMessage();
  };

  useEffect(() => {
    if (message === "item_added") {
      toast.success("Item added to cart");
    }

    if (message === "not_enough_stock") {
      toast.error("Not enough stock");
    }
  }, [message]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(book.stock_quantity, value));
    setQuantity(newQuantity);
  };

  const calculateDiscountedPrice = () => {
    if (!book) return 0;
    const price = parseFloat(book.price);
    const discount = parseFloat(book.discount_percentage || 0);
    return (price * (1 - discount / 100)).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-amber-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Book not found</p>
          <Button
            onClick={() => navigate("/books")}
            className="mt-4 bg-amber-600 hover:bg-amber-700"
          >
            Back to list
          </Button>
        </div>
      </div>
    );
  }

  const inStock = book.stock_quantity > 0;
  const allImages = [
    book.cover_image_url,
    ...(book.sample_page_urls || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/books")}
          className="mb-6 hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img
                    src={
                      selectedImage
                        ? `${
                            import.meta.env.VITE_API_IMAGE_URL
                          }${selectedImage}`
                        : "https://placehold.co/600x800?text=No+Image&font=roboto"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x800?text=No+Image&font=roboto";
                    }}
                  />
                  {book.discount_percentage > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                      -{book.discount_percentage}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === image
                        ? "border-amber-600"
                        : "border-gray-200 hover:border-amber-400"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE_URL}${image}`}
                      alt={`${book.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {book.title}
              </h1>

              {/* Authors */}
              {book.authors && book.authors.length > 0 && (
                <p className="text-lg text-gray-600">
                  Tác giả:{" "}
                  <span className="font-semibold text-gray-800">
                    {book.authors.map((author) => author.name).join(", ")}
                  </span>
                </p>
              )}
            </div>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/books?category=${category.name}`}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Price */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-amber-600">
                    ${calculateDiscountedPrice()}
                  </span>
                  {book.discount_percentage > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      ${parseFloat(book.price).toFixed(2)}
                    </span>
                  )}
                </div>

         
                {/* Stock status */}
                <div className="mt-4 flex items-center gap-2">
                  {inStock ? (
                    <>
                      <PackageCheck className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        In stock ({book.stock_quantity} books)
                      </span>
                    </>
                  ) : (
                    <>
                      <PackageX className="h-5 w-5 text-red-600" />
                      <span className="text-red-600 font-medium">Out of stock</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quantity & Actions */}
            {inStock && (
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-medium">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={book.stock_quantity}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= book.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold hover:cursor-pointer"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to cart
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="px-6 py-6 border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    <Heart className="h-5 w-5" />
                  </Button> */}
                </div>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Product description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Detailed information
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium text-gray-900">{book.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Slug:</span>
                    <span className="font-medium text-gray-900">
                      {book.slug}
                    </span>
                  </div>
                  {book.featured && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Featured:</span>
                      <span className="font-medium text-amber-600">Yes</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Created at:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(book.created_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
