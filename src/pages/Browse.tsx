import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import {
  fetchTmdbTrending,
  fetchTmdbTopRated,
  fetchTmdbPopular,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbSciFi,
  fetchTmdbHorror,
  fetchTmdbSeries,
  fetchTmdbNowPlaying,
  fetchTmdbUpcoming,
  fetchTmdbByGenre,
  TMDB_GENRES,
} from "@/lib/tmdb";
import { MediaCardData } from "@/types/cinematch";

const CATEGORIES: Record<string, { title: string; fetcher: (page: number) => Promise<MediaCardData[]> }> = {
  trending: { title: "🔥 Trending Now", fetcher: fetchTmdbTrending },
  toprated: { title: "⭐ Top Rated", fetcher: fetchTmdbTopRated },
  popular: { title: "🎬 Popular", fetcher: fetchTmdbPopular },
  nowplaying: { title: "🎬 Now Playing", fetcher: fetchTmdbNowPlaying },
  upcoming: { title: "📅 Upcoming", fetcher: fetchTmdbUpcoming },
  bollywood: { title: "🇮🇳 Bollywood", fetcher: fetchTmdbBollywood },
  superhero: { title: "🦸 Superhero", fetcher: fetchTmdbSuperhero },
  anime: { title: "🌸 Anime", fetcher: fetchTmdbAnime },
  scifi: { title: "🚀 Sci-Fi", fetcher: fetchTmdbSciFi },
  horror: { title: "👻 Horror", fetcher: fetchTmdbHorror },
  series: { title: "📺 TV Series", fetcher: fetchTmdbSeries },
  action: { title: "💥 Action", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.action, p) },
  comedy: { title: "😂 Comedy", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.comedy, p) },
  drama: { title: "🎭 Drama", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.drama, p) },
  romance: { title: "💕 Romance", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.romance, p) },
  thriller: { title: "🔪 Thriller", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.thriller, p) },
  fantasy: { title: "🧙 Fantasy", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.fantasy, p) },
  war: { title: "⚔️ War", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.war, p) },
  crime: { title: "🔫 Crime", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.crime, p) },
  adventure: { title: "🌍 Adventure", fetcher: (p) => fetchTmdbByGenre(TMDB_GENRES.adventure, p) },
};

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get("cat") || "trending";
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

  const category = CATEGORIES[cat] || CATEGORIES.trending;

  const { data, isLoading } = useQuery({
    queryKey: ["browse", cat, page],
    queryFn: () => category.fetcher(page),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container px-3 sm:px-4 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 space-y-4 sm:space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse</span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">{category.title}</h1>
        </div>

        {/* Category pills */}
        <div className="scroll-row gap-2 pb-2">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setSearchParams({ cat: key }); setPage(1); }}
              className={[
                "shrink-0 rounded-md px-4 py-2 text-xs font-medium transition",
                cat === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              ].join(" ")}
            >
              {val.title}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary mr-2" />
            Loading movies...
          </div>
        ) : data?.length ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.map((item) => (
              <CineMovieCard key={item.imdbID} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">No movies found for this category.</div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="heroSecondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button
            variant="heroSecondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </main>
      <DNAFooter />
    </div>
  );
};

export default BrowsePage;
