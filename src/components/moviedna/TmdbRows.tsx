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

function MovieRow({ config }: { config: RowConfig }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [config.queryKey],
    queryFn: () => config.fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (error) {
    return (
      <div style={{ padding: '16px 0' }}>
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <p className="text-sm text-destructive">Failed to load movies</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-muted rounded-md" style={{ width: 150, height: 225, flexShrink: 0 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Link
          to={config.link}
          className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
        {data.slice(0, 10).map((item) => (
          <Link
            key={item.imdbID}
            to={`/movie/${item.imdbID}`}
            style={{ width: 150, flexShrink: 0, display: 'block', textDecoration: 'none', color: 'inherit' }}
          >
            <img
              src={item.poster}
              alt={item.title}
              style={{ width: 150, height: 225, objectFit: 'cover', display: 'block', borderRadius: 8 }}
              loading="lazy"
            />
            <p className="text-xs font-semibold text-foreground truncate" style={{ marginTop: 6 }}>{item.title}</p>
            <p className="text-muted-foreground" style={{ fontSize: 10 }}>{item.year} · ⭐ {item.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TmdbRows() {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 16px' }}>
      {rows.map((config) => (
        <MovieRow key={config.queryKey} config={config} />
      ))}
    </div>
  );
}
