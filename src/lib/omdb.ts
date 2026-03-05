import { catalogById } from "@/data/cinematchCatalog";
import { MediaCardData, OmdbDetail } from "@/types/cinematch";

const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = "6a2ef45d";
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
  return Promise.all(ids.map((id) => fetchOmdbTitle(id)));
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

export function getTrailerSearchUrl(title: string, year?: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${year || ""} official trailer`)}`;
}

export function getWatchSearchUrl(title: string, year?: string) {
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(`${title} ${year || ""}`)}`;
}
