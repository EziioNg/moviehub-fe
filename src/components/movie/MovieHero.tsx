"use client";

import {
  Play,
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  getUserBookmarks,
  addMovieToBookmarks,
  removeMovieFromBookmarks,
} from "@/lib/api";

interface BookmarkMovie {
  _id: string;
  title: string;
  movieImage: string;
  rating?: number;
  year?: number;
}

interface MovieHeroProps {
  movie: {
    _id: string;
    title: string;
    movieImage: string;
    review?: string;
    year?: number;
    rating?: number;
    duration?: string;
    genre?: string[];
    director?: string;
    cast?: string[];
    movieURL?: string; // Add movieURL prop
  };
}

export default function MovieHero({ movie }: MovieHeroProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Check if movie is already bookmarked when component mounts
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user?._id) return;

      try {
        const bookmarks = await getUserBookmarks(user._id);
        const isAlreadyBookmarked = bookmarks.some(
          (bookmark: BookmarkMovie) => bookmark._id === movie._id,
        );
        setIsBookmarked(isAlreadyBookmarked);
      } catch (err) {
        console.error("Failed to check bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [user?._id, movie._id]);

  const handleBookmark = async () => {
    if (!user?._id) {
      addToast("Please login to bookmark movies", "error");
      router.push("/auth/login");
      return;
    }

    // Check if movie is already bookmarked
    if (isBookmarked) {
      addToast("This movie is already in your bookmarks!", "error");
      return;
    }

    setBookmarkLoading(true);
    try {
      await addMovieToBookmarks(user._id, movie._id);
      setIsBookmarked(true);
      addToast("Movie added to bookmarks!", "success");
    } catch (err) {
      addToast("Failed to bookmark movie", "error");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRemoveBookmark = async () => {
    if (!user?._id) {
      addToast("Please login to manage bookmarks", "error");
      return;
    }

    setBookmarkLoading(true);
    try {
      await removeMovieFromBookmarks(user._id, movie._id);
      setIsBookmarked(false);
      addToast("Movie removed from bookmarks!", "success");
    } catch (err) {
      addToast("Failed to remove bookmark", "error");
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="relative h-[70vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.movieImage}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0 -mt-20 lg:-mt-32">
              <img
                src={movie.movieImage}
                alt={movie.title}
                className="w-48 h-72 lg:w-64 lg:h-96 object-cover rounded-lg shadow-2xl border-4 border-white/10"
              />
            </div>

            {/* Movie Information */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Title and Year */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-white/80">
                  <span className="text-lg">{movie.year || 2025}</span>
                  <span>•</span>
                  <span className="text-lg">{movie.duration || "2h 30m"}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-medium">
                      {movie.rating || "8.0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {(movie.genre || ["Action", "Drama", "Thriller"]).map(
                  (genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ),
                )}
              </div>

              {/* Synopsis */}
              <div className="max-w-2xl">
                <p className="text-white/90 leading-relaxed text-lg">
                  {movie.review}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    if (movie.movieURL) {
                      // Pass movieURL as query parameter to avoid extra API call
                      router.push(
                        `/watch/${movie._id}?url=${encodeURIComponent(movie.movieURL)}`,
                      );
                    } else {
                      // Fallback to regular navigation if no movieURL
                      router.push(`/watch/${movie._id}`);
                    }
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading || isBookmarked}
                  className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                    isBookmarked
                      ? "bg-gray-600 text-white cursor-not-allowed"
                      : "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {bookmarkLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                  <span>Add to Watchlist</span>
                </button>
                {/* Remove Bookmark Button - Only shows when movie is bookmarked */}
                {isBookmarked && (
                  <button
                    onClick={handleRemoveBookmark}
                    disabled={bookmarkLoading}
                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookmarkLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    <span>Remove Bookmark</span>
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Released {movie.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
                <div>
                  <span>Director: {movie.director}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
