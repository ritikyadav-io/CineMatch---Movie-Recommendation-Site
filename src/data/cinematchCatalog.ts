import { CatalogEntry, DiscoverSectionKey, QuizAnswers } from "@/types/cinematch";

export const cineMatchCatalog: CatalogEntry[] = [
  {
    imdbID: "tt1375666",
    title: "Inception",
    type: "movie",
    year: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    language: "English",
    mood: "Mind-bending",
    violence: "Moderate",
    nudity: "None",
    runtime: "Long epic",
    complexity: "Mind-bending",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    shortDescription: "Dream-heist spectacle with blockbuster scale and brain-twisting layers.",
    searchTerms: ["nolan", "heist", "dream"]
  },
  {
    imdbID: "tt0816692",
    title: "Interstellar",
    type: "movie",
    year: 2014,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    language: "English",
    mood: "Emotional",
    violence: "None",
    nudity: "None",
    runtime: "Long epic",
    complexity: "Thought-provoking",
    actors: ["Matthew McConaughey", "Anne Hathaway"],
    shortDescription: "A sweeping space odyssey driven by love, sacrifice, and cosmic awe.",
    searchTerms: ["space", "nolan", "epic"]
  },
  {
    imdbID: "tt0468569",
    title: "The Dark Knight",
    type: "movie",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    language: "English",
    mood: "Dark and intense",
    violence: "Moderate",
    nudity: "None",
    runtime: "Long epic",
    complexity: "Thought-provoking",
    actors: ["Christian Bale", "Heath Ledger"],
    shortDescription: "A crime saga with operatic tension and an iconic villain performance.",
    searchTerms: ["batman", "joker", "dc"]
  },
  {
    imdbID: "tt6751668",
    title: "Parasite",
    type: "movie",
    year: 2019,
    genres: ["Thriller", "Drama", "Comedy"],
    language: "Korean",
    mood: "Dark and intense",
    violence: "Extreme",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Song Kang-ho", "Choi Woo-shik"],
    shortDescription: "A razor-sharp class thriller that turns from funny to ferocious.",
    searchTerms: ["bong joon-ho", "class", "oscar"]
  },
  {
    imdbID: "tt2543164",
    title: "Arrival",
    type: "movie",
    year: 2016,
    genres: ["Sci-Fi", "Drama"],
    language: "English",
    mood: "Emotional",
    violence: "None",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Amy Adams", "Jeremy Renner"],
    shortDescription: "Elegant first-contact sci-fi with emotional force and smart ideas.",
    searchTerms: ["aliens", "linguistics", "denis villeneuve"]
  },
  {
    imdbID: "tt3799694",
    title: "The Nice Guys",
    type: "movie",
    year: 2016,
    genres: ["Comedy", "Action", "Crime"],
    language: "English",
    mood: "Light and fun",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Simple entertainment",
    actors: ["Ryan Gosling", "Russell Crowe"],
    shortDescription: "A witty detective ride with swagger, chaos, and perfect buddy energy.",
    hiddenGem: true,
    searchTerms: ["buddy", "detective", "70s"]
  },
  {
    imdbID: "tt2194499",
    title: "About Time",
    type: "movie",
    year: 2013,
    genres: ["Romance", "Comedy", "Drama"],
    language: "English",
    mood: "Emotional",
    violence: "None",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Domhnall Gleeson", "Rachel McAdams"],
    shortDescription: "Warm romantic fantasy with heart, humor, and life-affirming charm.",
    hiddenGem: true,
    searchTerms: ["time travel", "romcom", "heartfelt"]
  },
  {
    imdbID: "tt5700672",
    title: "Train to Busan",
    type: "movie",
    year: 2016,
    genres: ["Horror", "Action", "Thriller"],
    language: "Korean",
    mood: "Dark and intense",
    violence: "Extreme",
    nudity: "None",
    runtime: "Medium",
    complexity: "Simple entertainment",
    actors: ["Gong Yoo", "Ma Dong-seok"],
    shortDescription: "A breakneck zombie thriller with emotion and unforgettable momentum.",
    searchTerms: ["zombie", "train", "survival"]
  },
  {
    imdbID: "tt5311514",
    title: "Your Name.",
    type: "movie",
    year: 2016,
    genres: ["Romance", "Drama", "Sci-Fi"],
    language: "Japanese",
    mood: "Emotional",
    violence: "None",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Ryunosuke Kamiki", "Mone Kamishiraishi"],
    shortDescription: "A gorgeous body-swap romance with cosmic scale and anime magic.",
    hiddenGem: true,
    searchTerms: ["anime", "body swap", "makoto shinkai"]
  },
  {
    imdbID: "tt0457430",
    title: "Pan's Labyrinth",
    type: "movie",
    year: 2006,
    genres: ["Drama", "Fantasy", "War"],
    language: "Spanish",
    mood: "Dark and intense",
    violence: "Extreme",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Ivana Baquero", "Sergi López"],
    shortDescription: "A haunting dark fairy tale painted with war, cruelty, and wonder.",
    hiddenGem: true,
    searchTerms: ["guillermo del toro", "fantasy", "spanish"]
  },
  {
    imdbID: "tt5074352",
    title: "Dangal",
    type: "movie",
    year: 2016,
    genres: ["Drama", "Sport", "Biography"],
    language: "Hindi",
    mood: "Emotional",
    violence: "None",
    nudity: "None",
    runtime: "Long epic",
    complexity: "Simple entertainment",
    actors: ["Aamir Khan", "Fatima Sana Shaikh"],
    shortDescription: "An uplifting underdog sports drama with powerful emotional payoff.",
    hiddenGem: true,
    searchTerms: ["sports", "wrestling", "inspiring"]
  },
  {
    imdbID: "tt12477480",
    title: "Decision to Leave",
    type: "movie",
    year: 2022,
    genres: ["Thriller", "Romance", "Drama"],
    language: "Korean",
    mood: "Mind-bending",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Park Hae-il", "Tang Wei"],
    shortDescription: "Seductive mystery cinema with noir elegance and emotional ambiguity.",
    hiddenGem: true,
    searchTerms: ["park chan-wook", "noir", "detective"]
  },
  {
    imdbID: "tt1160419",
    title: "Dune",
    type: "movie",
    year: 2021,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    language: "English",
    mood: "Dark and intense",
    violence: "Moderate",
    nudity: "None",
    runtime: "Long epic",
    complexity: "Thought-provoking",
    actors: ["Timothée Chalamet", "Zendaya"],
    shortDescription: "Mythic desert spectacle with imperial politics and thunderous scale.",
    searchTerms: ["villeneuve", "space", "epic"]
  },
  {
    imdbID: "tt6710474",
    title: "Everything Everywhere All at Once",
    type: "movie",
    year: 2022,
    genres: ["Sci-Fi", "Comedy", "Action"],
    language: "English",
    mood: "Mind-bending",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Long epic",
    complexity: "Mind-bending",
    actors: ["Michelle Yeoh", "Stephanie Hsu"],
    shortDescription: "Maximalist multiverse chaos delivered with humor, tenderness, and style.",
    searchTerms: ["multiverse", "daniels", "oscar"]
  },
  {
    imdbID: "tt7784604",
    title: "Hereditary",
    type: "movie",
    year: 2018,
    genres: ["Horror", "Drama", "Mystery"],
    language: "English",
    mood: "Dark and intense",
    violence: "Extreme",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Toni Collette", "Alex Wolff"],
    shortDescription: "Prestige horror that slowly tightens into dread and family collapse.",
    searchTerms: ["ari aster", "grief", "cult"]
  },
  {
    imdbID: "tt0903747",
    title: "Breaking Bad",
    type: "series",
    year: 2008,
    genres: ["Drama", "Crime", "Thriller"],
    language: "English",
    mood: "Dark and intense",
    violence: "Extreme",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Bryan Cranston", "Aaron Paul"],
    shortDescription: "An addictive transformation saga with masterful tension and character work.",
    searchTerms: ["drug", "crime", "walter white"]
  },
  {
    imdbID: "tt5753856",
    title: "Dark",
    type: "series",
    year: 2017,
    genres: ["Sci-Fi", "Thriller", "Drama"],
    language: "English",
    mood: "Mind-bending",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Mind-bending",
    actors: ["Louis Hofmann", "Lisa Vicari"],
    shortDescription: "A labyrinthine time-travel mystery built for intense binge sessions.",
    searchTerms: ["german", "time travel", "mind bending"]
  },
  {
    imdbID: "tt4574334",
    title: "Stranger Things",
    type: "series",
    year: 2016,
    genres: ["Sci-Fi", "Horror", "Drama"],
    language: "English",
    mood: "Light and fun",
    violence: "Moderate",
    nudity: "None",
    runtime: "Medium",
    complexity: "Simple entertainment",
    actors: ["Millie Bobby Brown", "Finn Wolfhard"],
    shortDescription: "Retro monster mystery with heart, synth energy, and big crowd-pleaser thrills.",
    searchTerms: ["netflix", "80s", "kids"]
  },
  {
    imdbID: "tt11280740",
    title: "Severance",
    type: "series",
    year: 2022,
    genres: ["Sci-Fi", "Thriller", "Drama"],
    language: "English",
    mood: "Mind-bending",
    violence: "Moderate",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Adam Scott", "Britt Lower"],
    shortDescription: "Corporate dystopia staged with eerie precision, wit, and puzzle-box tension.",
    searchTerms: ["office", "apple tv", "mystery"]
  },
  {
    imdbID: "tt11126994",
    title: "Arcane",
    type: "series",
    year: 2021,
    genres: ["Action", "Drama", "Sci-Fi"],
    language: "English",
    mood: "Emotional",
    violence: "Moderate",
    nudity: "None",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Hailee Steinfeld", "Ella Purnell"],
    shortDescription: "An animated series with painterly visuals and genuinely epic emotional stakes.",
    searchTerms: ["animation", "league of legends", "steampunk"]
  },
  {
    imdbID: "tt5290382",
    title: "Mindhunter",
    type: "series",
    year: 2017,
    genres: ["Crime", "Thriller", "Drama"],
    language: "English",
    mood: "Dark and intense",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Medium",
    complexity: "Thought-provoking",
    actors: ["Jonathan Groff", "Holt McCallany"],
    shortDescription: "A chilling serial-killer procedural wrapped in Fincher-grade atmosphere.",
    searchTerms: ["serial killer", "fbi", "fincher"]
  },
  {
    imdbID: "tt5687612",
    title: "Fleabag",
    type: "series",
    year: 2016,
    genres: ["Comedy", "Drama", "Romance"],
    language: "English",
    mood: "Light and fun",
    violence: "None",
    nudity: "Some",
    runtime: "Short (<100 minutes)",
    complexity: "Thought-provoking",
    actors: ["Phoebe Waller-Bridge", "Andrew Scott"],
    shortDescription: "Sharp, intimate, and hilarious with emotional depth hidden inside its wit.",
    searchTerms: ["british", "comedy", "romance"]
  },
  {
    imdbID: "tt14452776",
    title: "The Bear",
    type: "series",
    year: 2022,
    genres: ["Drama", "Comedy"],
    language: "English",
    mood: "Dark and intense",
    violence: "Moderate",
    nudity: "Some",
    runtime: "Short (<100 minutes)",
    complexity: "Thought-provoking",
    actors: ["Jeremy Allen White", "Ayo Edebiri"],
    shortDescription: "Kitchen panic, messy ambition, and raw human drama in a razor-fast binge.",
    searchTerms: ["chef", "restaurant", "fx"]
  }
];

export const catalogById = Object.fromEntries(cineMatchCatalog.map((entry) => [entry.imdbID, entry]));

export const sectionMap: Record<DiscoverSectionKey, { title: string; description: string; ids: string[] }> = {
  trending: {
    title: "Trending Movies",
    description: "Big-screen energy, undeniable buzz, and premium crowd-pleasers.",
    ids: ["tt1160419", "tt6710474", "tt1375666", "tt0816692", "tt6751668", "tt2543164"]
  },
  "top-rated": {
    title: "Top Rated Movies",
    description: "Critically adored films with standout ratings and serious replay value.",
    ids: ["tt0468569", "tt6751668", "tt1375666", "tt0816692", "tt2543164", "tt5311514"]
  },
  "hidden-gems": {
    title: "Hidden Gems",
    description: "Less obvious picks with elite taste-maker appeal.",
    ids: ["tt3799694", "tt2194499", "tt12477480", "tt0457430", "tt5074352", "tt5311514"]
  },
  series: {
    title: "Popular Series",
    description: "Prestige binge material, breakout hits, and addictive episode hooks.",
    ids: ["tt0903747", "tt5753856", "tt4574334", "tt11280740", "tt11126994", "tt14452776"]
  }
};

export const quizFieldsets = [
  { key: "contentType", label: "Content Type", options: ["movie", "series"] },
  { key: "genre", label: "Genre", options: ["Action", "Thriller", "Horror", "Sci-Fi", "Romance", "Comedy", "Drama", "Fantasy", "Animation", "Sport"] },
  { key: "language", label: "Language", options: ["English", "Korean", "Japanese", "Spanish", "Hindi", "Any"] },
  { key: "mood", label: "Mood", options: ["Light and fun", "Dark and intense", "Emotional", "Mind-bending"] },
  { key: "violence", label: "Violence / Gore Level", options: ["None", "Moderate", "Extreme"] },
  { key: "nudity", label: "Nudity Level", options: ["None", "Some", "Doesn't matter"] },
  { key: "releasePeriod", label: "Release Period", options: ["2020+", "2010-2020", "Before 2010"] },
  { key: "runtime", label: "Runtime Preference", options: ["Short (<100 minutes)", "Medium", "Long epic"] },
  { key: "complexity", label: "Story Complexity", options: ["Simple entertainment", "Thought-provoking", "Mind-bending"] },
  { key: "bollywoodVibe", label: "🎬 Bollywood Vibe", options: ["Classic romance", "Modern thriller", "Musical extravaganza", "Social drama", "Any"] },
  { key: "superheroPreference", label: "🦸 Superhero Preference", options: ["Marvel-style", "DC-style", "Indie/dark", "Animated", "Any"] },
  { key: "animeStyle", label: "🌸 Anime Style", options: ["Shonen action", "Romance/slice-of-life", "Dark/psychological", "Fantasy adventure", "Any"] },
] as const;

export const defaultQuizAnswers: QuizAnswers = {
  contentType: "movie",
  genre: "Action",
  language: "Any",
  mood: "Mind-bending",
  violence: "Moderate",
  nudity: "Doesn't matter",
  releasePeriod: "2010-2020",
  runtime: "Medium",
  complexity: "Thought-provoking",
  bollywoodVibe: "Any",
  superheroPreference: "Any",
  animeStyle: "Any",
};

const violenceRank = { None: 0, Moderate: 1, Extreme: 2 };
const nudityRank = { None: 0, Some: 1, "Doesn't matter": 2 };

export function filterCatalogByQuiz(answers: QuizAnswers) {
  return cineMatchCatalog
    .filter((entry) => entry.type === answers.contentType)
    .map((entry) => {
      let score = 0;
      if (entry.genres.includes(answers.genre)) score += 4;
      if (answers.language === "Any" || entry.language === answers.language) score += 3;
      if (entry.mood === answers.mood) score += 3;
      if (violenceRank[entry.violence] <= violenceRank[answers.violence]) score += 2;
      if (answers.nudity === "Doesn't matter" || nudityRank[entry.nudity] <= nudityRank[answers.nudity]) score += 2;
      if (
        (answers.releasePeriod === "2020+" && entry.year >= 2020) ||
        (answers.releasePeriod === "2010-2020" && entry.year >= 2010 && entry.year < 2020) ||
        (answers.releasePeriod === "Before 2010" && entry.year < 2010)
      ) score += 2;
      if (entry.runtime === answers.runtime) score += 2;
      if (entry.complexity === answers.complexity) score += 3;
      if (entry.hiddenGem) score += 0.3;
      return { ...entry, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score >= 6);
}

export function findCatalogMatches(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return cineMatchCatalog.filter((entry) => {
    const haystack = [
      entry.title,
      ...entry.genres,
      ...entry.actors,
      ...(entry.searchTerms ?? []),
      String(entry.year),
      entry.language,
      entry.type
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function getRandomCatalogPick() {
  return cineMatchCatalog[Math.floor(Math.random() * cineMatchCatalog.length)];
}

export function getRelatedCatalogEntries(imdbID: string, limit = 6) {
  const current = catalogById[imdbID];
  if (!current) return cineMatchCatalog.slice(0, limit);

  return cineMatchCatalog
    .filter((entry) => entry.imdbID !== imdbID && entry.type === current.type)
    .map((entry) => ({
      ...entry,
      score: entry.genres.filter((genre) => current.genres.includes(genre)).length + Number(entry.language === current.language)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
