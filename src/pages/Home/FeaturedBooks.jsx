import { useEffect, useState } from "react";
import BookService from "../../services/book.service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { CarTaxiFrontIcon, ShoppingCart, ShoppingCartIcon } from "lucide-react";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await BookService.user.getBooks({ featured: true });
      setBooks(res.data);
      console.log(res.data);
    };
    fetchBooks();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-2xl font-bold text-amber-600">Sách đáng chú ý</h1>

      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
          }}
          className="lg:w-5xl md:w-2xl w-full mx-auto mt-8 px-8"
        >
          <CarouselContent>
            {books?.map((book, index) => (
              <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card className=" overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img 
                        src={`${import.meta.env.VITE_API_IMAGE_URL}${book.cover_image_url}`} 
                        alt={book.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                      />
                      {book.discount_percentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                          -{book.discount_percentage}%
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-amber-600 transition-colors">
                        {book.title}
                      </h3>
                      {book.authors && book.authors.length > 0 && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {book.authors.map(author => author.name).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {book.discount_percentage > 0 ? (
                          <>
                            <span className="text-xl font-bold text-amber-600">
                              ${(book.price * (1 - book.discount_percentage / 100)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${parseFloat(book.price).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-amber-600">
                            ${parseFloat(book.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer">
                        <ShoppingCartIcon className="w-5 h-5" />
                        Add 
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-amber-100 rounded-full p-2 hover:cursor-pointer" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-100 rounded-full p-2 hover:cursor-pointer" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedBooks;
