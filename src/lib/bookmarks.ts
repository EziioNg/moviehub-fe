import apiInstance from "./apiInstance";

export interface BookmarkMovie {
  _id: string;
  title: string;
  movieImage: string;
  rating?: number;
  year?: number;
}

// Get user bookmarks
export async function getUserBookmarks(
  userId: string,
): Promise<BookmarkMovie[]> {
  try {
    const response = await apiInstance.get(`/users/${userId}/favorites`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    throw error;
  }
}

// Add bookmark
export async function addBookmark(
  userId: string,
  movieId: string,
): Promise<void> {
  try {
    await apiInstance.post(`/users/${userId}/favorites`, { movieId });
  } catch (error) {
    console.error("Failed to add bookmark:", error);
    throw error;
  }
}

// Remove bookmark
export async function removeBookmark(
  userId: string,
  movieId: string,
): Promise<void> {
  try {
    await apiInstance.delete(`/users/${userId}/favorites`, {
      data: { movieId },
    });
  } catch (error) {
    console.error("Failed to remove bookmark:", error);
    throw error;
  }
}
