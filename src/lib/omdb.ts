import { catalogById } from "@/data/cinematchCatalog";
import { MediaCardData, OmdbDetail } from "@/types/cinematch";

const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = "6a2ef45d";
const YOUTUBE_API_KEY = "AIzaSyAmsOCTFZOxfkTN2gMqswoezcjMp3OTQbQ";
const FALLBACK_POSTER = "/placeholder.svg";

function normalizePoster(poster: string) {
  return poster && poster !== "N/A" ? poster : FALLBACK_POSTER;
}

async function fetchOmdb(params: Record<string, string>) {
  const search = new URLSearchParams({ apikey: OMDB_API_KEY, ...params });
  const response = await fetch(`${OMDB_API_URL}?${search.toString()}`);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Unable to fetch data from OMDb.");
  }

  return data;
}

export async function fetchOmdbTitle(imdbID: string): Promise<MediaCardData> {
  const detail = (await fetchOmdb({ i: imdbID, plot: "short" })) as OmdbDetail;
  const meta = catalogById[imdbID];

  return {
    imdbID: detail.imdbID,
    title: detail.Title,
    year: detail.Year,
    rating: detail.imdbRating,
    genres: detail.Genre.split(", "),
    poster: normalizePoster(detail.Poster),
    overview: detail.Plot,
    language: detail.Language.split(",")[0] || meta?.language || "Any",
    type: detail.Type === "series" ? "series" : "movie",
    actors: detail.Actors?.split(", "),
    runtime: detail.Runtime
  };
}

export async function fetchOmdbBatch(ids: string[]) {
  const limited = ids.slice(0, 20);
  const results: MediaCardData[] = [];
  for (const id of limited) {
    try {
      const item = await fetchOmdbTitle(id);
      results.push(item);
    } catch {
      // skip failed fetches
    }
    if (results.length < limited.length) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  return results;
}

export async function searchOmdbTitles(query: string) {
  const data = await fetchOmdb({ s: query, type: "movie" });
  const items = (data.Search || []) as Array<{ Title: string; Year: string; imdbID: string; Poster: string; Type: string }>;

  return items.slice(0, 8).map((item) => ({
    imdbID: item.imdbID,
    title: item.Title,
    year: item.Year,
    rating: catalogById[item.imdbID] ? "Curated" : "IMDb",
    genres: catalogById[item.imdbID]?.genres || [item.Type === "series" ? "Series" : "Movie"],
    poster: normalizePoster(item.Poster),
    overview: catalogById[item.imdbID]?.shortDescription || "Tap to open details and explore the full story.",
    language: catalogById[item.imdbID]?.language || "English",
    type: item.Type === "series" ? "series" : "movie"
  } satisfies MediaCardData));
}

// YouTube Data API v3 — search for a trailer and return the video ID
export async function fetchYouTubeTrailerId(title: string, year?: string): Promise<string | null> {
  try {
    const query = `${title} ${year || ""} official trailer`;
    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: "1",
      key: YOUTUBE_API_KEY,
    });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.items?.[0]?.id?.videoId || null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getTrailerSearchUrl(title: string, year?: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${year || ""} official trailer`)}`;
}

export function getWatchSearchUrl(title: string, year?: string) {
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(`${title} ${year || ""}`)}`;
}
