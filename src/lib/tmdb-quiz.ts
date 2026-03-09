import { MediaCardData, QuizAnswers } from "@/types/cinematch";
import { supabase } from "@/integrations/supabase/client";

const TMDB_IMG = "https://image.tmdb.org/t/p";

function tmdbPoster(path: string | null, size = "w342") {
  return path ? `${TMDB_IMG}/${size}${path}` : "/placeholder.svg";
}

// Map quiz genre names to TMDB genre IDs
const GENRE_TO_TMDB: Record<string, number> = {
  action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80,
  drama: 18, fantasy: 14, horror: 27, romance: 10749, "sci-fi": 878,
  thriller: 53, war: 10752, sport: -1, // no direct TMDB genre for sport
};

// Map quiz language to TMDB language code
const LANG_TO_CODE: Record<string, string> = {
  english: "en", korean: "ko", japanese: "ja", spanish: "es", hindi: "hi",
};

// Map mood to TMDB sort/keyword strategies
function getMoodParams(mood: string): Record<string, string> {
  switch (mood) {
    case "Light and fun": return { sort_by: "popularity.desc", "vote_average.gte": "6" };
    case "Dark and intense": return { sort_by: "vote_average.desc", "vote_count.gte": "200", with_keywords: "3149|4565|6152" }; // dark, intense, gritty
    case "Emotional": return { sort_by: "vote_average.desc", "vote_count.gte": "200" };
    case "Mind-bending": return { sort_by: "vote_average.desc", "vote_count.gte": "100", with_keywords: "310|9882" }; // plot twist, mind-bending
    default: return { sort_by: "popularity.desc" };
  }
}

function getReleaseDateParams(period: string): Record<string, string> {
  const now = new Date().getFullYear();
  switch (period) {
    case "2020+": return { "primary_release_date.gte": "2020-01-01" };
    case "2010-2020": return { "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31" };
    case "Before 2010": return { "primary_release_date.lte": "2009-12-31" };
    default: return {};
  }
}

function getRuntimeParams(runtime: string): Record<string, string> {
  switch (runtime) {
    case "Short (<100 minutes)": return { "with_runtime.lte": "100" };
    case "Medium": return { "with_runtime.gte": "90", "with_runtime.lte": "150" };
    case "Long epic": return { "with_runtime.gte": "140" };
    default: return {};
  }
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("tmdb-proxy", {
    body: { endpoint, params },
  });
  if (error) throw new Error(`TMDB proxy error: ${error.message}`);
  return data;
}

interface TmdbResult {
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
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  53: "Thriller", 10752: "War", 37: "Western",
};

function mapResult(m: TmdbResult, type: "movie" | "series" = "movie"): MediaCardData {
  const prefix = type === "series" ? "tmdb-tv" : "tmdb";
  return {
    imdbID: `${prefix}-${m.id}`,
    title: m.title || m.name || "Untitled",
    year: (m.release_date || m.first_air_date || "").slice(0, 4),
    rating: m.vote_average?.toFixed(1) || "N/A",
    genres: m.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id] || "Other") || [],
    poster: tmdbPoster(m.poster_path),
    overview: m.overview || "No description available.",
    language: m.original_language || "en",
    type,
  };
}

/**
 * Fetch recommendations from TMDB based on quiz answers.
 * Uses /discover/movie or /discover/tv with filters matching user choices.
 */
export async function fetchQuizRecommendations(answers: QuizAnswers): Promise<MediaCardData[]> {
  const isTV = answers.contentType === "series";
  const endpoint = isTV ? "/discover/tv" : "/discover/movie";

  // Build params from quiz answers
  const params: Record<string, string> = {
    page: String(Math.floor(Math.random() * 3) + 1), // randomize page for variety
    "vote_count.gte": "50",
  };

  // Genre
  const genreId = GENRE_TO_TMDB[answers.genre.toLowerCase()];
  if (genreId && genreId > 0) {
    params.with_genres = String(genreId);
  }

  // Language
  if (answers.language !== "Any") {
    const langCode = LANG_TO_CODE[answers.language.toLowerCase()];
    if (langCode) {
      params.with_original_language = langCode;
    }
  }

  // Mood
  const moodParams = getMoodParams(answers.mood);
  Object.assign(params, moodParams);

  // Release period
  if (!isTV) {
    const dateParams = getReleaseDateParams(answers.releasePeriod);
    Object.assign(params, dateParams);
  }

  // Runtime (movies only)
  if (!isTV) {
    const rtParams = getRuntimeParams(answers.runtime);
    Object.assign(params, rtParams);
  }

  // Violence filter: if "None", exclude horror/war heavy content
  if (answers.violence === "None") {
    params.without_genres = "27,10752"; // exclude horror, war
  }

  const data = await tmdbFetch(endpoint, params);
  const results = (data.results || []) as TmdbResult[];

  return results
    .filter((m) => m.poster_path) // only items with posters
    .slice(0, 20)
    .map((m) => mapResult(m, isTV ? "series" : "movie"));
}
