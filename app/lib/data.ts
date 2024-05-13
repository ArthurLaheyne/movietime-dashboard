import { log } from 'console';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchMoviesLiked() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    const res = await fetch('https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/movies-liked', {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await res.json()
    
    return data.Items
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movies liked.');
  }
}

export async function fetchMoviesSeen() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    const res = await fetch('https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/movies-seen', {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await res.json()
    console.log(data.Items);
    
    return data.Items
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movies seen.');
  }
}

export async function fetchTMDBMovie(movie: number) {

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie}?api_key=3ba0366e8628beeac0b35a0fdfaf5c9b&language=fr`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch TMDB movie.');
  }
}