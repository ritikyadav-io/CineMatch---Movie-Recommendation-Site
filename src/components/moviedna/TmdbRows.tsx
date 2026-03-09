import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";

import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbSciFi,
  fetchTmdbTopRated,
  fetchTmdbHorror,
  fetchTmdbSeries,
  fetchTmdbNowPlaying,
} from "@/lib/tmdb";
import type { MediaCardData } from "@/types/cinematch";

interface RowConfig {
  title: string;
  queryKey: string;
  fetcher: (page?: number) => Promise<MediaCardData[]>;
  link: string;
}

const rows: RowConfig[] = [
  { title: "🔥 Trending Now", queryKey: "tmdb-trending", fetcher: fetchTmdbTrending, link: "/browse?cat=trending" },
  { title: "🎬 Now Playing", queryKey: "tmdb-nowplaying", fetcher: fetchTmdbNowPlaying, link: "/browse?cat=nowplaying" },
  { title: "⭐ Top Rated", queryKey: "tmdb-toprated", fetcher: fetchTmdbTopRated, link: "/browse?cat=toprated" },
  { title: "🇮🇳 Bollywood", queryKey: "tmdb-bollywood", fetcher: fetchTmdbBollywood, link: "/browse?cat=bollywood" },
  { title: "🦸 Superhero", queryKey: "tmdb-superhero", fetcher: fetchTmdbSuperhero, link: "/browse?cat=superhero" },
  { title: "🌸 Anime", queryKey: "tmdb-anime", fetcher: fetchTmdbAnime, link: "/browse?cat=anime" },
  { title: "🚀 Sci-Fi", queryKey: "tmdb-scifi", fetcher: fetchTmdbSciFi, link: "/browse?cat=scifi" },
  { title: "👻 Horror", queryKey: "tmdb-horror", fetcher: fetchTmdbHorror, link: "/browse?cat=horror" },
  { title: "📺 Trending Series", queryKey: "tmdb-series", fetcher: fetchTmdbSeries, link: "/browse?cat=series" },
];

/** Fisher-Yates shuffle seeded by a per-mount random value */
function shuffleArray<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function MovieRow({ config, seed }: { config: RowConfig; seed: number }) {
  const { data, isLoading } = useQuery({
    queryKey: [config.queryKey],
    queryFn: () => config.fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  // Shuffle once per mount (seed is stable per page visit, changes on each new visit)
  const displayed = useMemo(() => {
    if (!data?.length) return [];
    return shuffleArray(data, seed + config.queryKey.charCodeAt(5)).slice(0, 6);
  }, [data, seed, config.queryKey]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!displayed.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Link
          to={config.link}
          className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {displayed.map((item) => (
          <CineMovieCard key={item.imdbID} item={item} />
        ))}
      </div>
    </div>
  );
}

export function TmdbRows() {
  // New random seed per page visit — stable during the session, different each time you land
  const seed = useRef(Math.floor(Math.random() * 0x7fffffff)).current;

  return (
    <section className="container space-y-10 py-10 lg:py-14">
      {rows.map((config) => (
        <MovieRow key={config.queryKey} config={config} seed={seed} />
      ))}
    </section>
  );
}

/** Compact version: shows a single row of trending movies, useful for non-home pages */
export function TmdbMiniRow({ category = "trending" }: { category?: string }) {
  const config = rows.find((r) => r.queryKey === `tmdb-${category}`) || rows[0];
  
  const { data, isLoading } = useQuery({
    queryKey: [config.queryKey],
    queryFn: () => config.fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading || !data?.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Link
          to={config.link}
          className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {data.slice(0, 5).map((item) => (
          <CineMovieCard key={item.imdbID} item={item} />
        ))}
      </div>
    </section>
  );
}
