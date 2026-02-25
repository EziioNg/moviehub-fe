"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MovieHero from "@/components/movie/MovieHero";
import MovieInfo from "@/components/movie/MovieInfo";
import MovieReviews from "@/components/movie/MovieReviews";
import MiddleEarthSectionWrapper from "@/components/sections/MiddleEarthSectionWrapper";
import PiratesSectionWrapper from "@/components/sections/PiratesSectionWrapper";

// Movie interface matching backend schema from movieModel.js
interface Movie {
  _id: string;
  title: string;
  review: string;
  description: string;
  movieImage: string;
  movieURL: string;
  movieSub: string;
  categoryIds: string[];
  year?: number;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  _destroy: boolean;
}

export default function MoviePage({ movie }: { movie: Movie | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!movie) {
      // Movie is null, which means notFound() was called in parent
      // We can either show a 404 state here or redirect
      // For now, the parent will handle the 404 page
      return;
    }

    // Movie exists, but we might need to fetch additional data
    const fetchAdditionalData = async () => {
      try {
        setLoading(true);

        // Add default values for optional properties
        const movieWithDefaults: Movie = {
          ...movie,
          year: movie.year || 2025,
          rating: movie.rating || 8.0,
        };

        // Update state if needed (though movie is already passed from parent)
        // setMovie(movieWithDefaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [movie]);

  // Add focus/visibility change listener to handle page reload when returning from watch page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !loading && !movie) {
        // Page became visible but no movie data - this shouldn't happen with new structure
        // But we can handle it gracefully
        router.push("/404");
      }
    };

    const handleFocus = () => {
      if (!loading && !movie) {
        // Window gained focus but no movie data - redirect to 404
        router.push("/404");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [movie, loading, router]);

  if (!movie) {
    // Show 404 state when movie is null
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-2"
            >
              Go Home
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading movie details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Movie
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <MovieHero movie={movie} />
      <MovieInfo movie={movie} />
      <MovieReviews movieId={movie._id} averageRating={movie.rating} />

      {/* Popular Series Section */}
      <div className="py-8 text-center dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Popular Series
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You may also like these amazing movie collections
          </p>
        </div>
      </div>

      <MiddleEarthSectionWrapper />
      <PiratesSectionWrapper />
    </div>
  );
}
