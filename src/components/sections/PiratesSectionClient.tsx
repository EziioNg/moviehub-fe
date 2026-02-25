"use client";

import { useRouter } from "next/navigation";
import MovieCard from "@/components/ui/MovieCard";
// import { ChevronRight } from "lucide-react";

export default function PiratesSectionClient({
  seriesName,
  movies,
}: {
  seriesName: string;
  movies: any[];
}) {
  const router = useRouter();

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {seriesName}
            </h2>
            <span className="text-gray-600 dark:text-gray-400">Series</span>
          </div>
          {/* <button
            onClick={() => router.push("/movies")}
            className="flex items-center space-x-2 text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <span className="text-sm font-medium">View All Movies</span>
            <ChevronRight className="w-4 h-4" />
          </button> */}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
