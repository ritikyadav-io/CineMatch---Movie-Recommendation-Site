import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

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

function SimpleMovieCard({ item }: { item: MediaCardData }) {
  return (
    <Link
      to={`/movie/${item.imdbID}`}
      className="group block w-[140px] sm:w-[160px] flex-shrink-0"
    >
      <div className="relative overflow-hidden rounded-md bg-muted" style={{ aspectRatio: '2/3' }}>
        <img
          src={item.poster}
          alt={item.title}
          className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-2">
          <div className="flex items-center gap-1 text-xs text-foreground">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            {item.rating}
          </div>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <h3 className="truncate text-xs font-semibold text-foreground">{item.title}</h3>
        <p className="text-[10px] text-muted-foreground">{item.year}</p>
      </div>
    </Link>
  );
}

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
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[140px] sm:w-[160px] flex-shrink-0 rounded-md bg-muted" style={{ aspectRatio: '2/3' }} />
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
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.slice(0, 10).map((item) => (
          <SimpleMovieCard key={item.imdbID} item={item} />
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
