import apiInstance from "./apiInstance";

export interface Series {
  _id: string;
  title: string;
  description?: string;
  poster?: string;
}

export interface Movie {
  _id: string;
  title: string;
  movieImage: string;
  year?: number;
  rating?: number;
  duration?: string;
  genre?: string[];
  director?: string;
  cast?: string[];
  awards?: string[];
  seriesId?: string;
}

// Get series by ID
export async function getSeriesById(seriesId: string): Promise<Series | null> {
  try {
    const response = await apiInstance.get(`/series/${seriesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching series:", error);
    return null;
  }
}

// Get movies by series ID
export async function getMoviesBySeriesId(seriesId: string): Promise<Movie[]> {
  try {
    const response = await apiInstance.get(`/series/${seriesId}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by series:", error);
    return [];
  }
}

// Get all series
export async function getAllSeries(query?: string): Promise<Series[]> {
  try {
    const url = query
      ? `/series?search=${encodeURIComponent(query)}`
      : "/series";
    const response = await apiInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
}
