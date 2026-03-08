import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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
import { MediaCardData } from "@/types/cinematch";

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

function MovieRow({ config }: { config: RowConfig }) {
  const { data, isLoading } = useQuery({
    queryKey: [config.queryKey],
    queryFn: () => config.fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="scroll-row gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-40 shrink-0 aspect-[2/3] animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

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
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        {data.map((item) => (
          <div
            key={item.imdbID}
            className="w-36 sm:w-40 flex-none"
          >
            <CineMovieCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TmdbRows() {
  return (
    <section className="container space-y-8 py-8 lg:py-12">
      {rows.map((config) => (
        <MovieRow key={config.queryKey} config={config} />
      ))}
    </section>
  );
}
