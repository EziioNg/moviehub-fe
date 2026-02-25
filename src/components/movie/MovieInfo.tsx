"use client";

import { Users, Film, Award, Calendar } from "lucide-react";
import mockCasts from "./mockCasts";

interface MovieInfoProps {
  movie: {
    director?: string;
    cast?: string[];
    genre?: string[];
    year?: number;
    rating?: number;
    awards?: string[];
  };
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <section className="py-12 bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cast Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Cast & Crew
              </h2>
            </div>

            <div className="space-y-6">
              {/* Director */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Director
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <Film className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {movie.director}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Director
                    </p>
                  </div>
                </div>
              </div>

              {/* Cast */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Top Cast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockCasts.slice(0, 6).map((cast) => (
                    <div key={cast.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={cast.imageUrl}
                          alt={cast.actor}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {cast.actor}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {cast.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Film className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Movie Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Rating */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {movie.rating}/10
                  </span>
                </div>
              </div>

              {/* Year */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Release Year
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {movie.year}
                </span>
              </div>

              {/* Genres */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Genres</span>
                <div className="flex flex-wrap gap-1">
                  {movie.genre?.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Awards */}
              {movie.awards && movie.awards.length > 0 && (
                <div className="py-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Awards
                    </span>
                  </div>
                  <div className="space-y-1">
                    {movie.awards.map((award, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        🏆 {award}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
