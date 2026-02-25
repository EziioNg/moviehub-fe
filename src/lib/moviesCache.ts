// Simple in-memory cache for movies by category data
interface MoviesCache {
  [categoryId: string]: {
    movies: any[];
    timestamp: number;
    expiry: number;
  };
}

class MoviesDataCache {
  private cache: MoviesCache = {};
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Get cached movies by category or fetch if not cached/expired
  async getMoviesByCategory(categoryId: string): Promise<any[]> {
    const now = Date.now();
    const cached = this.cache[categoryId];

    // Return cached data if valid
    if (cached && now < cached.timestamp + cached.expiry) {
      // console.log(`🎬 Using cached movies data for category: ${categoryId}`);
      return cached.movies;
    }

    // Fetch fresh data if not cached or expired
    try {
      // console.log(`🔄 Fetching fresh movies data for category: ${categoryId}`);
      const { getMoviesByCategoryId } = await import("./api");
      const response = await getMoviesByCategoryId(categoryId);

      // Handle nested response structure
      const moviesData = (response as any).movies || response;
      const movies = Array.isArray(moviesData) ? moviesData : [];

      // Cache the data
      this.cache[categoryId] = {
        movies,
        timestamp: now,
        expiry: this.CACHE_DURATION,
      };
      // console.log(`✅ Cached movies data for category: ${categoryId}`);

      return movies;
    } catch (error) {
      console.error(`Error fetching movies for category ${categoryId}:`, error);
      // Return cached data if available even if expired, otherwise return empty array
      return cached?.movies || [];
    }
  }

  // Get multiple categories at once (batch optimization)
  async getMoviesByCategories(
    categoryIds: string[],
  ): Promise<{ [categoryId: string]: any[] }> {
    const results: { [categoryId: string]: any[] } = {};

    // Fetch all categories in parallel
    await Promise.all(
      categoryIds.map(async (categoryId) => {
        results[categoryId] = await this.getMoviesByCategory(categoryId);
      }),
    );

    return results;
  }

  // Clear cache for specific category or all
  clearCache(categoryId?: string): void {
    if (categoryId) {
      delete this.cache[categoryId];
      // console.log(`🗑️ Cleared cache for category: ${categoryId}`);
    } else {
      this.cache = {};
      // console.log(`🗑️ Cleared all movies cache`);
    }
  }

  // Get cache status
  getCacheStatus(): {
    [categoryId: string]: { cached: boolean; expiresIn: number; count: number };
  } {
    const now = Date.now();
    const status: {
      [categoryId: string]: {
        cached: boolean;
        expiresIn: number;
        count: number;
      };
    } = {};

    Object.keys(this.cache).forEach((categoryId) => {
      const cached = this.cache[categoryId];
      const expiresIn = Math.max(0, cached.timestamp + cached.expiry - now);
      status[categoryId] = {
        cached: now < cached.timestamp + cached.expiry,
        expiresIn: Math.floor(expiresIn / 1000), // in seconds
        count: cached.movies.length,
      };
    });

    return status;
  }

  // Force refresh for specific category
  async refreshMoviesByCategory(categoryId: string): Promise<any[]> {
    this.clearCache(categoryId);
    return this.getMoviesByCategory(categoryId);
  }

  // Get total cached items count
  getTotalCachedCount(): number {
    return Object.values(this.cache).reduce(
      (total, cached) => total + cached.movies.length,
      0,
    );
  }
}

// Export singleton instance
export const moviesCache = new MoviesDataCache();
