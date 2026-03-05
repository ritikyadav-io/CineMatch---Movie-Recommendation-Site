import { Film, Heart, Popcorn, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CineFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-spotlight shadow-glow">
              <Film className="size-5 text-primary-foreground" />
            </div>
            <p className="font-display text-2xl uppercase tracking-[0.25em] text-primary">CineMatch</p>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            CineMatch pairs stylish discovery with quick taste profiling, so every recommendation feels like opening night.
          </p>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">API credit to The Movie Database inspiration and live OMDb data</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.22em] text-foreground">About</p>
            <Link className="story-link" to="/discover">Discover</Link>
            <Link className="story-link" to="/quiz">Movie Quiz</Link>
            <Link className="story-link" to="/discover?section=hidden-gems">Hidden Gems</Link>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.22em] text-foreground">Contact</p>
            <a className="story-link inline-flex items-center gap-2" href="mailto:hello@cinematch.app"><Heart className="size-4 text-primary" />hello@cinematch.app</a>
            <Link className="story-link" to="/privacy">Privacy Policy</Link>
            <a className="story-link inline-flex items-center gap-2" href="https://www.omdbapi.com/" target="_blank" rel="noreferrer"><Popcorn className="size-4 text-primary" />OMDb API</a>
            <a className="story-link inline-flex items-center gap-2" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><Sparkles className="size-4 text-primary" />TMDB Credit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
