import { fetchTMDBMovie } from "@/app/lib/data";

export default async function MovieLink({
  movie,
}: {
  movie: number;
}) {
  const TMDBMovie = await fetchTMDBMovie(movie);
  

  return (
    <a href={`https://www.themoviedb.org/movie/${movie.toString()}`} target="_blank">{TMDBMovie.title}</a>
  );
}