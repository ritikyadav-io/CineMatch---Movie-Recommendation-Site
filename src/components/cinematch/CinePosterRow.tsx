import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { MediaCardData } from "@/types/cinematch";

interface CinePosterRowProps {
  actionHref: string;
  actionLabel: string;
  description: string;
  items: MediaCardData[];
  title: string;
}

export function CinePosterRow({ actionHref, actionLabel, description, items, title }: CinePosterRowProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Curated spotlight</p>
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-foreground sm:text-4xl">{title}</h2>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="ghostGold" size="sm">
          <Link to={actionHref}>
            {actionLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item, index) => (
          <CineMovieCard key={item.imdbID} item={item} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
