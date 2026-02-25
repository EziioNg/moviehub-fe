"use client";

import { Star, Play } from "lucide-react";

export default function MovieDetails() {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-12 bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
              alt="Inception Poster"
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Information */}
          <div className="flex-1 space-y-6">
            {/* Awards */}
            <div className="flex items-center space-x-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                🏆 Won 1 Oscar
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Synopsis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dom Cobb is a skilled thief, the absolute best in the dangerous
                art of extraction, stealing valuable secrets from deep within
                the subconscious during the dream state, when the mind is at its
                most vulnerable. Cobb's rare ability has made him a coveted
                player in this treacherous new world of corporate espionage, but
                it has also made him an international fugitive and cost him
                everything he has ever loved.
              </p>
            </div>

            {/* Starring */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Starring
              </h3>
              <div className="flex items-center space-x-4">
                {[
                  "Leonardo DiCaprio",
                  "Marion Cotillard",
                  "Tom Hardy",
                  "Ellen Page",
                ].map((actor, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + index * 1000000000}?w=100&h=100&fit=crop&face=center`}
                      alt={actor}
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 w-20 truncate">
                      {actor}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Director */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Director
              </h3>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face=center"
                  alt="Christopher Nolan"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Christopher Nolan
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    British filmmaker
                  </p>
                </div>
              </div>
            </div>

            {/* Videos */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Videos
              </h3>
              <div className="flex space-x-4">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=170&fit=crop"
                    alt="Trailer"
                    className="w-48 h-28 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm mt-2 text-center text-gray-900 dark:text-white">
                    Trailer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
