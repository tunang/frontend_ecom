import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import banner1 from "@/assets/images/banner/1.jpg";
import banner2 from "@/assets/images/banner/2.jpg";
import banner3 from "@/assets/images/banner/3.jpg";

const Banner = () => {
  const bannerImages = [banner1, banner2, banner3];

  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    // Immediately set state in case initial selected isn't 0
    onSelect();

    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full relative">
      <Carousel setApi={setApi} className="w-full relative">
        <CarouselContent>
          {bannerImages.map((image, idx) => (
            <CarouselItem key={idx}>
              <img
                src={image}
                alt={`Banner ${idx + 1}`}
                className="w-full h-auto object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-amber-100 rounded-full p-2 hover:cursor-pointer" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-100 rounded-full p-2 hover:cursor-pointer" />
      </Carousel>

      <div className=" absolute bottom-6 left-0 right-0 ">
        <span className="bg-amber-100 rounded-full p-2 flex justify-center items-center space-x-2 mt-4 w-fit mx-auto ">
          {bannerImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (api) api.scrollTo(idx);
              }}
              className={`h-3 w-3 rounded-full hover:cursor-pointer ${
                idx === selectedIndex ? "bg-amber-600" : "bg-gray-300"
              }`}
            />
          ))}
        </span>
      </div>
    </div>
  );
};

export default Banner;
