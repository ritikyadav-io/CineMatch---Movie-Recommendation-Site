import { Heart, Popcorn, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function DNAFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded bg-primary">
              <span className="text-xs font-black text-primary-foreground">M</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-foreground">
              Movie <span className="text-primary">DNA</span>
            </span>
          </div>
          <p className="max-w-md text-xs leading-5 text-muted-foreground">
            Movie DNA decodes your cinematic taste — blending Hollywood, Bollywood, superhero, and anime universes into one discovery engine.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Powered by OMDb API & YouTube Data
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 text-xs">
          <div className="space-y-2 text-muted-foreground">
            <p className="font-semibold text-foreground text-xs">Explore</p>
            <Link className="block hover:text-foreground transition" to="/discover">Discover</Link>
            <Link className="block hover:text-foreground transition" to="/quiz">Movie Quiz</Link>
            <Link className="block hover:text-foreground transition" to="/discover?section=hidden-gems">Hidden Gems</Link>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p className="font-semibold text-foreground text-xs">Info</p>
            <a className="flex items-center gap-1.5 hover:text-foreground transition" href="mailto:hello@moviedna.app">
              <Heart className="size-3 text-primary" />hello@moviedna.app
            </a>
            <Link className="block hover:text-foreground transition" to="/privacy">Privacy Policy</Link>
            <a className="flex items-center gap-1.5 hover:text-foreground transition" href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">
              <Popcorn className="size-3 text-primary" />OMDb API
            </a>
            <a className="flex items-center gap-1.5 hover:text-foreground transition" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              <Sparkles className="size-3 text-primary" />TMDB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
