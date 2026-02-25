"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    movieImage: string;
    year?: number;
    rating?: number;
    review?: string;
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movie/${movie._id}`);
  };

  return (
    <div
      className="flex-shrink-0 w-full cursor-pointer group"
      onClick={handleClick}
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
  );
}
