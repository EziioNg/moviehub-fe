"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContentRowProps {
  title: string;
}

export default function ContentRow({ title }: ContentRowProps) {
  const router = useRouter();

  // Dummy movie data
  const movies = [
    { id: 1, title: "Inception", year: 2010, rating: 8.8 },
    { id: 2, title: "The Dark Knight", year: 2008, rating: 9.0 },
    { id: 3, title: "Interstellar", year: 2014, rating: 8.6 },
    { id: 4, title: "The Matrix", year: 1999, rating: 8.7 },
    { id: 5, title: "Pulp Fiction", year: 1994, rating: 8.9 },
    { id: 6, title: "The Shawshank Redemption", year: 1994, rating: 9.3 },
    { id: 7, title: "Fight Club", year: 1999, rating: 8.8 },
    { id: 8, title: "Forrest Gump", year: 1994, rating: 8.8 },
  ];

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 group cursor-pointer"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="relative w-48 h-72 overflow-hidden rounded-lg">
                <img
                  src={`https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop&auto=format`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <h3 className="mt-2 font-medium text-sm">{movie.title}</h3>
              <p className="text-xs text-gray-500">
                {movie.year} • ⭐ {movie.rating}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
