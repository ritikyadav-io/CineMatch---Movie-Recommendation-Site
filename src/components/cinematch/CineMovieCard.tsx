import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { MediaCardData } from "@/types/cinematch";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";
import { fetchTmdbFullDetail } from "@/lib/tmdb-detail";

interface CineMovieCardProps {
  item: MediaCardData;
  priority?: boolean;
}

export function CineMovieCard({ item, priority = false }: CineMovieCardProps) {
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    const tmdbId = item.imdbID.startsWith("tmdb-") ? Number(item.imdbID.replace("tmdb-", "")) : null;
    if (tmdbId) {
      queryClient.prefetchQuery({
        queryKey: ["movie-detail", item.imdbID],
        queryFn: () => fetchTmdbFullDetail(tmdbId),
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
        <img
          src={item.poster}
          alt={`${item.title} poster`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WatchlistButton movie={item} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1.5 p-1 sm:p-2">
        <div className="flex items-start justify-between gap-0.5">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[9px] sm:text-xs font-semibold text-foreground">{item.title}</h3>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground">{item.year}</p>
          </div>
          <span className="flex items-center gap-0.5 shrink-0 text-[8px] sm:text-[10px] font-semibold text-foreground">
            <Star className="size-2 sm:size-2.5 fill-yellow-500 text-yellow-500" />
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
