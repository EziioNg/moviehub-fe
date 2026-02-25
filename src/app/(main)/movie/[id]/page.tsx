import { notFound } from "next/navigation";
import MovieClient from "./MovieClient";
import { getMovieDetails } from "@/lib/api";

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = params.id;

  if (!isValidObjectId(movieId)) {
    notFound();
  }

  try {
    const movie = await getMovieDetails(movieId);

    if (!movie) {
      notFound();
    }

    return <MovieClient movie={movie} />;
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }

    throw error;
  }

  // return <MovieClient movieId={movieId} />;
}
