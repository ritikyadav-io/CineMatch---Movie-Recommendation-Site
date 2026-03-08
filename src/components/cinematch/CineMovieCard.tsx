import { Star } from "lucide-react";
import { Link } from "react-router-dom";

import { MediaCardData } from "@/types/cinematch";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";

interface CineMovieCardProps {
  item: MediaCardData;
  priority?: boolean;
}

export function CineMovieCard({ item, priority = false }: CineMovieCardProps) {
  return (
    <Link
      to={`/movie/${item.imdbID}`}
      className="group relative flex flex-col overflow-hidden rounded-md bg-card transition-all duration-300 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={item.poster}
          alt={`${item.title} poster`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WatchlistButton movie={item} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.year}</p>
          </div>
          <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-foreground">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            {item.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
