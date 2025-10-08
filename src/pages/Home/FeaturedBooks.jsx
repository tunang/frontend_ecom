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
import BookCard from "../../components/BookCard";
import { useCartStore } from "../../store/useCartStore";
import { toast } from "sonner";
import TestStore from "../../components/TestStore";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const { message, clearMessage } = useCartStore();
  useEffect(() => {
    if (message === "item_added") {
      toast.success("Item added to cart");
      clearMessage();
    }

    if (message === "not_enough_stock") {
      toast.error("Not enough stock");
      clearMessage();
    }
  }, [message]);
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
      <h1 className="text-2xl font-bold text-amber-600">Featured Books</h1>

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
                <div className=" overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <BookCard book={book}/>
                </div>
             
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
