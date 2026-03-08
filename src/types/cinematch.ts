export type ContentType = "movie" | "series";
export type ViolenceLevel = "None" | "Moderate" | "Extreme";
export type NudityLevel = "None" | "Some" | "Full Nude" | "Doesn't matter";
export type RuntimePreference = "Short (<100 minutes)" | "Medium" | "Long epic";
export type ComplexityLevel = "Simple entertainment" | "Thought-provoking" | "Mind-bending";
export type DiscoverSectionKey = "trending" | "top-rated" | "hidden-gems" | "series";
export type BollywoodVibe = "Classic romance" | "Modern thriller" | "Musical extravaganza" | "Social drama" | "Any";
export type SuperheroPreference = "Marvel-style" | "DC-style" | "Indie/dark" | "Animated" | "Any";
export type AnimeStyle = "Shonen action" | "Romance/slice-of-life" | "Dark/psychological" | "Fantasy adventure" | "Any";

export interface CatalogEntry {
  imdbID: string;
  title: string;
  type: ContentType;
  year: number;
  genres: string[];
  language: string;
  mood: "Light and fun" | "Dark and intense" | "Emotional" | "Mind-bending";
  violence: ViolenceLevel;
  nudity: NudityLevel;
  runtime: RuntimePreference;
  complexity: ComplexityLevel;
  actors: string[];
  shortDescription: string;
  hiddenGem?: boolean;
  searchTerms?: string[];
  bollywoodVibe?: string;
  superheroStyle?: string;
  animeStyle?: string;
}

export interface QuizAnswers {
  contentType: ContentType;
  genre: string;
  language: string;
  mood: CatalogEntry["mood"];
  violence: ViolenceLevel;
  nudity: NudityLevel;
  releasePeriod: "2020+" | "2010-2020" | "Before 2010";
  runtime: RuntimePreference;
  complexity: ComplexityLevel;
  bollywoodVibe: BollywoodVibe;
  superheroPreference: SuperheroPreference;
  animeStyle: AnimeStyle;
}

export interface MediaCardData {
  imdbID: string;
  title: string;
  year: string;
  rating: string;
  genres: string[];
  poster: string;
  overview: string;
  language: string;
  type: ContentType;
  actors?: string[];
  runtime?: string;
}

export interface OmdbDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Language: string;
  imdbRating: string;
  Poster: string;
  Plot: string;
  Type: string;
  Actors?: string;
  Runtime?: string;
  Released?: string;
  totalSeasons?: string;
  Response: "True" | "False";
  Error?: string;
}
