import { MediaCardData } from "@/types/cinematch";
import { supabase } from "@/integrations/supabase/client";

const TMDB_IMG = "https://image.tmdb.org/t/p";

function tmdbPoster(path: string | null, size = "w342") {
  return path ? `${TMDB_IMG}/${size}${path}` : "/placeholder.svg";
}

interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
  genre_ids: number[];
  original_language: string;
  media_type?: string;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

function mapTmdbToCard(movie: TmdbMovie, type: "movie" | "series" = "movie"): MediaCardData {
  return {
    imdbID: `tmdb-${movie.id}`,
    title: movie.title || movie.name || "Untitled",
    year: (movie.release_date || movie.first_air_date || "").slice(0, 4),
    rating: movie.vote_average?.toFixed(1) || "N/A",
    genres: movie.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id] || "Other") || [],
    poster: tmdbPoster(movie.poster_path),
    overview: movie.overview || "No description available.",
    language: movie.original_language || "en",
    type,
  };
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("tmdb-proxy", {
    body: { endpoint, params },
  });
  if (error) throw new Error(`TMDB proxy error: ${error.message}`);
  return data;
}

// ── Discover categories ──

export async function fetchTmdbTrending(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/trending/movie/week", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

export async function fetchTmdbTopRated(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/movie/top_rated", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

export async function fetchTmdbPopular(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/movie/popular", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

export async function fetchTmdbUpcoming(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/movie/upcoming", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

export async function fetchTmdbNowPlaying(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/movie/now_playing", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Genre-based discovery ──

export async function fetchTmdbByGenre(genreId: number, page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Bollywood / Hindi ──
export async function fetchTmdbBollywood(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_original_language: "hi",
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Anime (Japanese animation) ──
export async function fetchTmdbAnime(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: "16",
    with_original_language: "ja",
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Superhero ──
export async function fetchTmdbSuperhero(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: "28",
    with_keywords: "9715|180547",
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Sci-Fi ──
export async function fetchTmdbSciFi(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: "878",
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Horror ──
export async function fetchTmdbHorror(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: "27",
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── TV Series ──
export async function fetchTmdbSeries(page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/trending/tv/week", { page: String(page) });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m, "series"));
}

// ── Search ──
export async function searchTmdb(query: string, page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/search/multi", { query, page: String(page) });
  return data.results
    .filter((m: TmdbMovie) => m.media_type === "movie" || m.media_type === "tv")
    .map((m: TmdbMovie) => mapTmdbToCard(m, m.media_type === "tv" ? "series" : "movie"));
}

// ── Similar movies ──
export async function fetchTmdbSimilar(tmdbId: number, page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch(`/movie/${tmdbId}/similar`, { page: String(page) });
  return (data.results || []).map((m: TmdbMovie) => mapTmdbToCard(m));
}

// ── Search by person (actor/actress) ──
export interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: TmdbMovie[];
}

export async function searchTmdbPerson(query: string): Promise<TmdbPerson[]> {
  const data = await tmdbFetch("/search/person", { query });
  return data.results
    .filter((p: TmdbPerson) => p.known_for_department === "Acting")
    .slice(0, 5);
}

export async function fetchTmdbPersonMovies(personId: number, page = 1): Promise<MediaCardData[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_cast: String(personId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results.map((m: TmdbMovie) => mapTmdbToCard(m));
}

export function tmdbProfileImage(path: string | null, size = "w185") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

// ── Movie detail ──
export async function fetchTmdbDetail(tmdbId: number): Promise<MediaCardData & { tmdbId: number }> {
  const data = await tmdbFetch(`/movie/${tmdbId}`);
  return {
    imdbID: data.imdb_id || `tmdb-${tmdbId}`,
    tmdbId,
    title: data.title,
    year: (data.release_date || "").slice(0, 4),
    rating: data.vote_average?.toFixed(1) || "N/A",
    genres: data.genres?.map((g: { name: string }) => g.name) || [],
    poster: tmdbPoster(data.poster_path),
    overview: data.overview || "No description available.",
    language: data.original_language || "en",
    type: "movie",
    actors: [],
    runtime: data.runtime ? `${data.runtime} min` : undefined,
  };
}

// Genre IDs for quick access
export const TMDB_GENRES = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  fantasy: 14,
  horror: 27,
  romance: 10749,
  scifi: 878,
  thriller: 53,
  war: 10752,
};
