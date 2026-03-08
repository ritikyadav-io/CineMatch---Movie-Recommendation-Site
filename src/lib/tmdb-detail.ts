import { supabase } from "@/integrations/supabase/client";

const TMDB_IMG = "https://image.tmdb.org/t/p";

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface TmdbFullDetail {
  imdbID: string;
  tmdbId: number;
  title: string;
  year: string;
  rating: string;
  genres: string[];
  poster: string;
  backdrop_path: string | null;
  overview: string;
  tagline: string;
  language: string;
  runtime: string | null;
  budget: number;
  revenue: number;
  certification: string;
  director: string | null;
  trailer: string | null;
  cast: TmdbCastMember[];
  watch_providers_us: { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] };
  watch_providers_in: { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] };
}

export async function fetchTmdbFullDetail(tmdbId: number): Promise<TmdbFullDetail> {
  const { data, error } = await supabase.functions.invoke("tmdb-proxy", {
    body: { endpoint: `/movie/${tmdbId}`, detail: true },
  });

  if (error) throw new Error(`Detail fetch error: ${error.message}`);

  return parseTmdbDetail(data, tmdbId);
}

export async function fetchTmdbFullDetailByImdb(imdbId: string): Promise<TmdbFullDetail> {
  // Use TMDB's find endpoint to convert IMDB ID → TMDB ID
  const { data: findData, error: findError } = await supabase.functions.invoke("tmdb-proxy", {
    body: { endpoint: `/find/${imdbId}`, params: { external_source: "imdb_id" } },
  });

  if (findError) throw new Error(`Find error: ${findError.message}`);

  const tmdbId = findData?.movie_results?.[0]?.id || findData?.tv_results?.[0]?.id;
  if (!tmdbId) throw new Error("Movie not found on TMDB");

  return fetchTmdbFullDetail(tmdbId);
}

function parseTmdbDetail(data: any, tmdbId: number): TmdbFullDetail {
  return {
    imdbID: data.imdb_id || `tmdb-${tmdbId}`,
    tmdbId,
    title: data.title || "Untitled",
    year: (data.release_date || "").slice(0, 4),
    rating: data.vote_average?.toFixed(1) || "N/A",
    genres: data.genres?.map((g: { name: string }) => g.name) || [],
    poster: data.poster_path ? `${TMDB_IMG}/w500${data.poster_path}` : "/placeholder.svg",
    backdrop_path: data.backdrop_path,
    overview: data.overview || "No description available.",
    tagline: data.tagline || "",
    language: data.original_language || "en",
    runtime: data.runtime ? `${data.runtime} min` : null,
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    certification: data.certification || "",
    director: data.director || null,
    trailer: data.trailer || null,
    cast: data.cast || [],
    watch_providers_us: data.watch_providers_us || {},
    watch_providers_in: data.watch_providers_in || {},
  };
}
