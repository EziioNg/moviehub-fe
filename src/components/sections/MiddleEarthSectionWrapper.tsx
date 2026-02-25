"use client";

import { useState, useEffect } from "react";
import MiddleEarthSectionClient from "./MiddleEarthSectionClient";
import { seriesCache } from "@/lib/seriesCache";

const SERIES_ID = "689709d4fe13b2ce71e90c0c";

export default function MiddleEarthSectionWrapper() {
  const [series, setSeries] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Use cache instead of direct API calls
        const data = await seriesCache.getSeriesData(SERIES_ID);

        if (data) {
          setSeries(data.series);
          setMovies(data.movies);
        }
      } catch (error) {
        console.error("Error fetching Middle Earth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!series || !movies.length) {
    return null;
  }

  return <MiddleEarthSectionClient seriesName={series.name} movies={movies} />;
}
