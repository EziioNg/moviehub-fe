// Simple in-memory cache for categories data
interface CategoriesCache {
  categories: any[];
  timestamp: number;
  expiry: number;
}

class CategoriesDataCache {
  private cache: CategoriesCache | null = null;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Get cached categories or fetch if not cached/expired
  async getCategories(): Promise<any[]> {
    const now = Date.now();

    // Return cached data if valid
    if (this.cache && now < this.cache.timestamp + this.cache.expiry) {
      // console.log("🎬 Using cached categories data");
      return this.cache.categories;
    }

    // Fetch fresh data if not cached or expired
    try {
      // console.log("🔄 Fetching fresh categories data");
      const { getCategories } = await import("./api");
      const response = await getCategories();

      // Handle nested response structure
      const categoriesData = (response as any).categories || response;
      const categories = Array.isArray(categoriesData) ? categoriesData : [];

      // Cache the data
      this.cache = {
        categories,
        timestamp: now,
        expiry: this.CACHE_DURATION,
      };
      // console.log("✅ Cached categories data");

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return cached data if available even if expired, otherwise return empty array
      return this.cache?.categories || [];
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache = null;
    // console.log("🗑️ Cleared categories cache");
  }

  // Get cache status
  getCacheStatus(): { cached: boolean; expiresIn: number; count: number } {
    if (!this.cache) {
      return { cached: false, expiresIn: 0, count: 0 };
    }

    const now = Date.now();
    const expiresIn = Math.max(
      0,
      this.cache.timestamp + this.cache.expiry - now,
    );

    return {
      cached: now < this.cache.timestamp + this.cache.expiry,
      expiresIn: Math.floor(expiresIn / 1000), // in seconds
      count: this.cache.categories.length,
    };
  }

  // Force refresh (bypass cache)
  async refreshCategories(): Promise<any[]> {
    this.clearCache();
    return this.getCategories();
  }
}

// Export singleton instance
export const categoriesCache = new CategoriesDataCache();
