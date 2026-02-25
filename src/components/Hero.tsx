"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Bookmark,
  BookmarkCheck,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getUserBookmarks, getMovies, addMovieToBookmarks } from "@/lib/api";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface BookmarkMovie {
  _id: string;
  title: string;
  movieImage: string;
  rating?: number;
  year?: number;
}

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

export default function Hero() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout>();
  const restartAutoScrollRef = useRef<NodeJS.Timeout>();

  // Fetch movies and select random ones
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMovies(1, 50); // Use centralized API function
        const allMovies = response.movies;

        // Select 5 random movies for hero carousel
        const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
        const selectedMovies = shuffled.slice(0, 5);

        setMovies(selectedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [addToast]);

  // Auto-scroll functionality with restart after inactivity
  useEffect(() => {
    if (isAutoScrolling && movies.length > 0) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, movies.length]);

  // Restart auto-scroll after 10 seconds of inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;

      if (timeSinceLastInteraction >= 10000 && !isAutoScrolling) {
        // 10 seconds
        setIsAutoScrolling(true);
      }
    };

    restartAutoScrollRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (restartAutoScrollRef.current) {
        clearInterval(restartAutoScrollRef.current);
      }
    };
  }, [lastInteraction, isAutoScrolling]);

  // Check bookmark status when movie changes
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user?._id || !movies[currentIndex]?._id) return;

      try {
        const bookmarks = await getUserBookmarks(user._id);
        const isAlreadyBookmarked = bookmarks.some(
          (bookmark: BookmarkMovie) =>
            bookmark._id === movies[currentIndex]._id,
        );
        setIsBookmarked(isAlreadyBookmarked);
      } catch (err) {
        console.error("Failed to check bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [user?._id, movies, currentIndex]);

  const handlePrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length,
    );
    setIsAutoScrolling(false); // Stop auto-scroll when user interacts
    setLastInteraction(Date.now()); // Update last interaction time
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsAutoScrolling(false); // Stop auto-scroll when user interacts
    setLastInteraction(Date.now()); // Update last interaction time
  };

  const handleSlideIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false); // Stop auto-scroll when user interacts
    setLastInteraction(Date.now()); // Update last interaction time
  };

  const handleWatchNow = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  const handleAddToWatchlist = async (movieId: string) => {
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
      await addMovieToBookmarks(user._id, movieId);

      setIsBookmarked(true);
      addToast("Movie added to bookmarks!", "success");
    } catch (err) {
      addToast("Failed to bookmark movie", "error");
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900">
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 bg-red-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900">
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-xl">No featured movies available</p>
        </div>
      </section>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <motion.img
              src={currentMovie.movieImage}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="px-4 md:px-8 lg:px-16 max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-white mb-4"
              >
                {currentMovie.title}
              </motion.h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center space-x-4 mb-4"
              >
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + star * 0.1 }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (currentMovie.rating || 4)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-white text-sm">
                  {(currentMovie.rating || 4.5).toFixed(1)} (
                  {Math.floor(Math.random() * 5000) + 1000} reviews)
                </span>
              </motion.div>

              {/* Movie Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center space-x-4 text-white text-sm mb-6"
              >
                <span className="bg-gray-800 px-2 py-1 rounded">PG-13</span>
                <span>2h {Math.floor(Math.random() * 30) + 90}min</span>
                <span>Action, Drama, Thriller</span>
                <span>
                  {currentMovie.year ||
                    new Date(currentMovie.createdAt).getFullYear()}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-white text-sm mb-8 line-clamp-3"
              >
                {currentMovie.description || currentMovie.review}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center space-x-4"
              >
                <motion.button
                  onClick={() => handleWatchNow(currentMovie._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </motion.button>
                <motion.button
                  onClick={() => handleAddToWatchlist(currentMovie._id)}
                  disabled={bookmarkLoading}
                  className="bg-gray-800/80 hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: bookmarkLoading ? 1 : 1.05 }}
                  whileTap={{ scale: bookmarkLoading ? 1 : 0.95 }}
                >
                  {bookmarkLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.button
              onClick={() => handleWatchNow(currentMovie._id)}
              className="pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6 transition-all hover:scale-110"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-12 h-12 text-white fill-white" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
      >
        <motion.button
          onClick={handlePrevSlide}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
      >
        <motion.button
          onClick={handleNextSlide}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Slide Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex space-x-2">
          {movies.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleSlideIndicatorClick(index)}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              initial={{ scale: 0 }}
              animate={{
                scale: index === currentIndex ? 1 : 0.8,
                width: index === currentIndex ? 32 : 8,
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{ height: "8px" }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
