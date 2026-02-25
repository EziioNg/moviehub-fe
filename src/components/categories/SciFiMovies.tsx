"use client";

import { useState, useEffect } from "react";
import MovieCarousel from "@/components/MovieCarousel";
import { moviesCache } from "@/lib/moviesCache";
import { Movie } from "@/lib/api";

const CATEGORY_ID = "6874c96d346bbf62467bee96";

export default function ScifiMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // Use cache instead of direct API call
        const moviesData = await moviesCache.getMoviesByCategory(CATEGORY_ID);

        // Add year and rating if not present in backend
        const moviesWithDefaults = moviesData.map((movie) => ({
          ...movie,
          year: movie.year || 2023, // Default year if not present
          rating: movie.rating || 8.0, // Default rating if not present
        }));

        setMovies(moviesWithDefaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sci-Fi Movies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Future worlds and advanced technology
          </p>
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48">
                <div className="bg-gray-300 dark:bg-gray-700 h-72 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sci-Fi Movies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Future worlds and advanced technology
          </p>
          <div className="text-red-500 dark:text-red-400">
            Failed to load movies: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <MovieCarousel
      title="Sci-Fi Movies"
      subtitle="Future worlds and advanced technology"
      movies={movies}
      viewAllHref="/category/sci-fi"
    />
  );
}
