"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Film } from "lucide-react";
import { searchMovies } from "@/lib/api";

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

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBox({
  placeholder = "Search movies...",
  className = "",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Real search function using API
  const searchMoviesAPI = async (searchQuery: string): Promise<Movie[]> => {
    if (!searchQuery.trim()) return [];

    try {
      const data = await searchMovies(searchQuery);
      return data;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 0) {
        setIsLoading(true);
        try {
          const data = await searchMoviesAPI(query);
          setResults(data);
        } catch (err) {
          console.error("Search error:", err);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    setIsOpen(query.length > 0 || results.length > 0);
  }, [query, results]);

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie._id}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 pl-12 pr-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Clear Button */}
        {query.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto backdrop-blur-sm">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((movie) => (
                <li key={movie._id}>
                  <button
                    onClick={() => handleMovieClick(movie)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-600">
                      <img
                        src={movie.movieImage}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {movie.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {movie.year
                          ? `${movie.year} • ${movie.rating || "N/A"}`
                          : movie.review || "No description"}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 0 && !isLoading ? (
            <div className="px-4 py-8 text-center">
              <Film className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No movies found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Try searching with different keywords
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
