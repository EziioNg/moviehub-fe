// Simple in-memory cache for series data
interface SeriesCache {
  [seriesId: string]: {
    series: any;
    movies: any[];
    timestamp: number;
    expiry: number;
  };
}

class SeriesDataCache {
  private cache: SeriesCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Get cached data or fetch if not cached/expired
  async getSeriesData(
    seriesId: string,
  ): Promise<{ series: any; movies: any[] } | null> {
    const cached = this.cache[seriesId];
    const now = Date.now();

    // Return cached data if valid
    if (cached && now < cached.timestamp + cached.expiry) {
      // console.log(`🎬 Using cached data for series: ${seriesId}`);
      return {
        series: cached.series,
        movies: cached.movies,
      };
    }

    // Fetch fresh data if not cached or expired
    try {
      // console.log(`🔄 Fetching fresh data for series: ${seriesId}`);
      const { getSeriesById, getMoviesBySeriesId } = await import("./api");
      const [seriesData, moviesRes] = await Promise.all([
        getSeriesById(seriesId),
        getMoviesBySeriesId(seriesId),
      ]);

      if (seriesData && moviesRes?.movies?.length) {
        // Cache the data
        this.cache[seriesId] = {
          series: seriesData,
          movies: moviesRes.movies,
          timestamp: now,
          expiry: this.CACHE_DURATION,
        };
        // console.log(`✅ Cached data for series: ${seriesId}`);
      }

      return {
        series: seriesData,
        movies: moviesRes.movies || [],
      };
    } catch (error) {
      console.error(`❌ Error fetching series data for ${seriesId}:`, error);
      return null;
    }
  }

  // Clear cache for a specific series
  clearCache(seriesId?: string): void {
    if (seriesId) {
      delete this.cache[seriesId];
      // console.log(`🗑️ Cleared cache for series: ${seriesId}`);
    } else {
      this.cache = {};
      // console.log(`🗑️ Cleared all series cache`);
    }
  }

  // Get cache status
  getCacheStatus(): { [key: string]: { cached: boolean; expiresIn: number } } {
    const now = Date.now();
    const status: { [key: string]: { cached: boolean; expiresIn: number } } =
      {};

    Object.keys(this.cache).forEach((seriesId) => {
      const cached = this.cache[seriesId];
      const expiresIn = Math.max(0, cached.timestamp + cached.expiry - now);
      status[seriesId] = {
        cached: now < cached.timestamp + cached.expiry,
        expiresIn: Math.floor(expiresIn / 1000), // in seconds
      };
    });

    return status;
  }
}

// Export singleton instance
export const seriesCache = new SeriesDataCache();
