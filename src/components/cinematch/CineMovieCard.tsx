import { Film, Star, Tv } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { MediaCardData } from "@/types/cinematch";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";
import { fetchTmdbFullDetail } from "@/lib/tmdb-detail";

interface CineMovieCardProps {
  item: MediaCardData;
  priority?: boolean;
}

export function CineMovieCard({ item, priority = false }: CineMovieCardProps) {
  const queryClient = useQueryClient();
  const [loaded, setLoaded] = useState(false);

  const prefetch = useCallback(() => {
    const isTmdbTv = item.imdbID.startsWith("tmdb-tv-");
    const isTmdbMovie = !isTmdbTv && item.imdbID.startsWith("tmdb-");
    const tmdbId = isTmdbTv ? Number(item.imdbID.replace("tmdb-tv-", "")) : isTmdbMovie ? Number(item.imdbID.replace("tmdb-", "")) : null;
    const mediaType = isTmdbTv ? "tv" as const : "movie" as const;
    if (tmdbId) {
      queryClient.prefetchQuery({
        queryKey: ["movie-detail", item.imdbID],
        queryFn: () => fetchTmdbFullDetail(tmdbId, mediaType),
        staleTime: 1000 * 60 * 60,
      });
    }
  }, [item.imdbID, queryClient]);

  return (
    <Link
      to={`/movie/${item.imdbID}`}
      onMouseEnter={prefetch}
      onTouchStart={prefetch}
      className="group relative flex flex-col overflow-hidden rounded-md bg-card transition-all duration-300 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {/* Shimmer placeholder */}
        {!loaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={item.poster}
          alt={`${item.title} poster`}
          className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        {/* Type badge */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5">
          {item.type === "series" ? (
            <span className="flex items-center gap-0.5 rounded bg-accent/90 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold uppercase tracking-wide text-accent-foreground">
              <Tv className="size-2 sm:size-2.5" /> Series
            </span>
          ) : (
            <span className="flex items-center gap-0.5 rounded bg-primary/90 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold uppercase tracking-wide text-primary-foreground">
              <Film className="size-2 sm:size-2.5" /> Movie
            </span>
          )}
        </div>
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WatchlistButton movie={item} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1.5 p-1.5 sm:p-2">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[11px] sm:text-xs font-semibold text-foreground">{item.title}</h3>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">{item.year}</p>
          </div>
          <span className="flex items-center gap-0.5 shrink-0 text-[9px] sm:text-[10px] font-semibold text-foreground">
            <Star className="size-2.5 sm:size-2.5 fill-yellow-500 text-yellow-500" />
            {item.rating}
          </span>
        </div>
        <div className="hidden sm:flex flex-wrap gap-1">
          {item.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded bg-secondary px-1.5 py-0.5 text-[8px] text-secondary-foreground">{genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
