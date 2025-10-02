import { useEffect, useState } from "react";
import BookService from "../../services/book.service";

const FeaturedBooks = () => {

    const [books, setBooks] = useState([])

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await BookService.user.getBooks({featured: true})
            setBooks(res.data)
            console.log(res.data)
        }
        fetchBooks()
    }, [])
  return (
    <div className="flex flex-col items-center justify-center mt-10">
    <h1 className="text-2xl font-bold text-amber-600   ">
      Sách đáng chú ý
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-amber-100 p-4 rounded-lg">
        {books?.map((book) => (
            <div key={book.id}>
                <img src={book.image} alt={book.title} />
                <h2>{book.title}</h2>
                <p>{book.author}</p>
            </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default FeaturedBooks;