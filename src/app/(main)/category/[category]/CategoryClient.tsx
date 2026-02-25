"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Calendar,
} from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import { getMoviesByCategoryId, Movie } from "@/lib/api";

// Extended Movie interface for UI components
interface ExtendedMovie extends Movie {
  duration?: string;
  genre?: string[];
  director?: string;
  cast?: string[];
}

export default function CategoryClient({
  category,
  categoryId,
}: {
  category: string;
  categoryId: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("title");
  const [movies, setMovies] = useState<ExtendedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch movies by category ID
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // if (!categoryId) {
        //   throw new Error(`Category "${category}" not found`);
        // }

        const response = await getMoviesByCategoryId(categoryId);

        // Add missing properties that might not be in backend
        const moviesWithDefaults: ExtendedMovie[] = response.movies.map(
          (movie) => ({
            ...movie,
            year: movie.year || 2023,
            rating: movie.rating || 8.0,
            duration: (movie as any).duration || "2h", // Default duration
            genre: (movie as any).genre || ["Drama"], // Default genre
            director: (movie as any).director || "Unknown Director", // Default director
          }),
        );

        setMovies(moviesWithDefaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie: ExtendedMovie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a: ExtendedMovie, b: ExtendedMovie) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Category metadata
  const getCategoryInfo = (cat: string) => {
    const categories = {
      adventure: {
        title: "Adventure Movies",
        description: "Embark on thrilling journeys and epic adventures",
        color: "bg-green-500",
      },
      action: {
        title: "Action Movies",
        description: "High-octane thrills and explosive entertainment",
        color: "bg-red-500",
      },
      "sci-fi": {
        title: "Sci-Fi Movies",
        description: "Explore futuristic worlds and scientific wonders",
        color: "bg-blue-500",
      },
    };
    return (
      categories[cat as keyof typeof categories] || {
        title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Movies`,
        description: "Discover amazing films in this category",
        color: "bg-gray-500",
      }
    );
  };

  const categoryInfo = getCategoryInfo(category);

  const MovieCard = ({ movie }: { movie: ExtendedMovie }) => (
    <div
      onClick={() => router.push(`/movie/${movie._id}`)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.movieImage}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <span>View Details</span>
            </button>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-white text-xs">
          {movie.year}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {movie.title}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {movie.rating}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {movie.duration}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre?.slice(0, 2).map((g: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
            >
              {g}
            </span>
          ))}
          {(movie.genre?.length || 0) > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{(movie.genre?.length || 0) - 2}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {movie.review}
        </p>
      </div>
    </div>
  );

  const MovieListItem = ({ movie }: { movie: ExtendedMovie }) => (
    <div
      onClick={() => router.push(`/movie/${movie._id}`)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-4 flex space-x-4 group"
    >
      <div className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden">
        <img
          src={movie.movieImage}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1">{movie.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre?.map((g: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
            >
              {g}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {movie.review}
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>Director: {movie.director}</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-4 h-4 rounded-full ${categoryInfo.color}`}></div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {categoryInfo.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {categoryInfo.description}
          </p>
        </div>
        {/* Filters and Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${category} movies...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="title">Sort by Title</option>
                <option value="year">Sort by Year</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-slate-600 shadow-sm" : ""}`}
              >
                <Grid className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-slate-600 shadow-sm" : ""}`}
              >
                <List className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        // Results Count
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredMovies.length} of {movies.length} {category} movies
          </p>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading {category} movies...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the latest movies
            </p>
          </div>
        )}
        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-400 dark:text-red-500 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load movies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {/* Movies Grid/List */}
        {!loading && !error && filteredMovies.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                : "space-y-4"
            }
          >
            {filteredMovies.map((movie) =>
              viewMode === "grid" ? (
                <MovieCard key={movie._id} movie={movie} />
              ) : (
                <MovieListItem key={movie._id} movie={movie} />
              ),
            )}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {category} movies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or browse other categories
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
