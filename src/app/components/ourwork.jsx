"use client";

import { useState } from "react";
import Image from "next/image";

const workItems = [
  {
    id: 0,
    images: ["/img1.png", "/img2.png"],
    description: "First product",
  },
  {
    id: 1,
    images: ["/img3.png", "/img4.png"],
    description: "Second product",
  },
  {
    id: 2,
    images: ["/img1.png"],
    description: "Third product",
  },
  {
    id: 3,
    images: ["/img3.png", "/img4.png"],
    description: "Fourth product",
  },
  {
    id: 4,
    images: ["/img1.png"],
    description: "Fifth product",
  },
  {
    id: 5,
    images: ["/img1.png"],
    description: "Fifth product",
  },
  {
    id: 6,
    images: ["/img1.png", "/img1.png"],
    description: "Fifth product",
  },
];

function WorkCard({ item }) {
  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className=" bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
        <Image
          src={item.images[index]}
          alt="work image"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Slider Buttons BELOW image */}
      {item.images.length > 1 && (
        <div className="flex justify-between px-3 py-2">
          <button
            onClick={prevImage}
            className="text-sm border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
          >
            ‹
          </button>

          <button
            onClick={nextImage}
            className="text-sm border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
          >
            ›
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-3 pb-4 text-sm text-center text-gray-700">
        {item.description}
      </div>
    </div>
  );
}

export default function OurWorkSection() {
  return (
    <section  id="ourwork" className="w-full ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className=" ourwork text-xl md:text-2xl font-black uppercase tracking-wide text-gray-900">
            Our Work
          </h2>
          <div className="mt-2 h-1 w-16 bg-amber-500"></div>
        </div>

        {/* 4–5 cards per row */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {workItems.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
