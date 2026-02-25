"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Movie {
  _id: string;
  title: string;
  movieImage: string;
  review?: string;
  year?: number;
  rating?: number;
}

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllHref?: string;
  className?: string;
}

const MovieCarousel = ({
  title,
  subtitle,
  movies,
  viewAllHref,
  className = "",
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const timeout = setTimeout(checkScroll, 100);
    return () => clearTimeout(timeout);
  }, [movies]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const router = useRouter();

  if (movies.length === 0) {
    return null; // Don't render if no movies
  }

  return (
    <div className={`w-full py-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 md:px-8 lg:px-16">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <span className="text-gray-600 dark:text-gray-400">{subtitle}</span>
          )}
        </div>
        {viewAllHref && (
          <button
            onClick={() => router.push(viewAllHref)}
            className="flex items-center space-x-2 text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Carousel */}
      <div className="relative group/scroll">
        {/* Left Scroll Button */}
        {showLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-all duration-200 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Scroll Button */}
        {showRight && (
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-all duration-200 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-8 lg:px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => router.push(`/movie/${movie._id}`)}
              className="flex-shrink-0 w-48 cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={movie.movieImage}
                  alt={movie.title}
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-red-600 text-white p-3 rounded-full">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium text-sm truncate">
                {movie.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                {movie.year && <span>{movie.year}</span>}
                {movie.rating && <span>⭐ {movie.rating}</span>}
                {movie.review && <span>{movie.review}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
