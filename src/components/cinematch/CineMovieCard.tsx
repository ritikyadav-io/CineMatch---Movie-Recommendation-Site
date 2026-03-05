import { Star } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { MediaCardData } from "@/types/cinematch";

interface CineMovieCardProps {
  item: MediaCardData;
  priority?: boolean;
}

export function CineMovieCard({ item, priority = false }: CineMovieCardProps) {
  return (
    <Link
      to={`/movie/${item.imdbID}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/90 shadow-poster transition duration-500 hover:-translate-y-2 hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={item.poster}
          alt={`${item.title} poster`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-card-sheen opacity-0 transition duration-700 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.year}</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
            <Star className="size-3 fill-primary text-primary" />
            {item.rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="rounded-full border border-border/60 bg-secondary/80 px-3 py-1 text-xs font-medium text-secondary-foreground">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
