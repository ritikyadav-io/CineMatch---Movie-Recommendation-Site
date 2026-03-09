import { Heart, Popcorn, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "@/assets/dna-logo.jpeg";

export function DNAFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid gap-4 sm:gap-8 py-5 sm:py-10 px-3 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2">
          <Link to="/">
            <img src={logo} alt="Movies DNA" className="h-7 sm:h-9 w-auto rounded" />
          </Link>
          <p className="max-w-md text-[10px] sm:text-xs leading-4 sm:leading-5 text-muted-foreground">
            Movies DNA decodes your cinematic taste — blending Hollywood, Bollywood, superhero, and anime universes into one discovery engine.
          </p>
          <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">
            Powered by OMDb API & YouTube Data
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 text-[10px] sm:text-xs">
          <div className="space-y-1.5 text-muted-foreground">
            <p className="font-semibold text-foreground text-[10px] sm:text-xs">Explore</p>
            <Link className="block hover:text-foreground transition" to="/discover">Discover</Link>
            <Link className="block hover:text-foreground transition" to="/quiz">Movie Quiz</Link>
            <Link className="block hover:text-foreground transition" to="/discover?section=hidden-gems">Hidden Gems</Link>
          </div>
          <div className="space-y-1.5 text-muted-foreground">
            <p className="font-semibold text-foreground text-[10px] sm:text-xs">Info</p>
            <a className="flex items-center gap-1 hover:text-foreground transition" href="mailto:primehrithik@gmail.com">
              <Heart className="size-2.5 text-primary" />primehrithik@gmail.com
            </a>
            <Link className="block hover:text-foreground transition" to="/privacy">Privacy Policy</Link>
            <a className="flex items-center gap-1 hover:text-foreground transition" href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">
              <Popcorn className="size-2.5 text-primary" />OMDb API
            </a>
            <a className="flex items-center gap-1 hover:text-foreground transition" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              <Sparkles className="size-2.5 text-primary" />TMDB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
