import Banner from "./Banner";

const HomePage = () => {
  return (
    <div className="w-full mt-6">
      <Banner />


      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-2xl font-bold text-amber-600   ">
          Sách đáng chú ý
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-amber-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold">Sách 1</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;