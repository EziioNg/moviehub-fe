"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/video/VideoPlayer";

interface Movie {
  _id: string;
  title: string;
  movieURL?: string;
  movieImage?: string;
  duration?: number;
  year?: number;
  rating?: number;
  genre?: string[];
  director?: string;
  cast?: string[];
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = params.movieId as string;
  const movieUrlFromQuery = searchParams?.get("url");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMovie = async () => {
      try {
        setLoading(true);

        // If we have movieURL from query params, use it immediately (no API call needed)
        if (movieUrlFromQuery) {
          const movieFromQuery: Movie = {
            _id: movieId,
            title: "Movie", // We'll get title from minimal API call or use default
            movieURL: decodeURIComponent(movieUrlFromQuery),
            movieImage:
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop",
            duration: 596, // Default duration
            year: 2023,
            rating: 8.0,
            genre: ["Drama"],
            director: "Unknown Director",
            cast: [],
          };

          setMovie(movieFromQuery);
          setLoading(false);
          return;
        }

        // Fallback: If no movieURL in query, make API call
        // This is a fallback scenario - normally we should have the URL
        const mockMovie: Movie = {
          _id: movieId,
          title: "Inception",
          movieURL:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          movieImage:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop",
          duration: 596,
          year: 2010,
          rating: 8.8,
          genre: ["Action", "Sci-Fi", "Thriller"],
          director: "Christopher Nolan",
          cast: [
            "Leonardo DiCaprio",
            "Marion Cotillard",
            "Tom Hardy",
            "Ellen Page",
          ],
        };

        setMovie(mockMovie);
      } catch (err) {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      initializeMovie();
    }
  }, [movieId, movieUrlFromQuery]);

  const handleBack = () => {
    router.push(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The movie you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer movieId={movieId} movie={movie} onBack={handleBack} />
    </div>
  );
}
