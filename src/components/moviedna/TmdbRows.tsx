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
  const { data, isLoading } = useQuery({
    queryKey: [config.queryKey],
    queryFn: () => config.fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div>
        <div className="h-5 w-40 animate-pulse rounded bg-muted mb-3" />
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ width: 150, height: 225, flexShrink: 0, borderRadius: 8, background: 'var(--muted, #333)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Link
          to={config.link}
          className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {data.slice(0, 10).map((item) => (
          <Link
            key={item.imdbID}
            to={`/movie/${item.imdbID}`}
            style={{ width: 150, flexShrink: 0, textDecoration: 'none' }}
            className="group"
          >
            <div style={{ width: 150, height: 225, borderRadius: 8, overflow: 'hidden', position: 'relative' }} className="bg-muted">
              <img
                src={item.poster}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 6, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                <span className="flex items-center gap-1 text-xs text-foreground">
                  <Star className="size-3" style={{ color: '#eab308', fill: '#eab308' }} />
                  {item.rating}
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold text-foreground mt-1.5 truncate">{item.title}</p>
            <p className="text-[10px] text-muted-foreground">{item.year}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TmdbRows() {
  return (
    <section style={{ padding: '32px 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {rows.map((config) => (
          <MovieRow key={config.queryKey} config={config} />
        ))}
      </div>
    </section>
  );
}
