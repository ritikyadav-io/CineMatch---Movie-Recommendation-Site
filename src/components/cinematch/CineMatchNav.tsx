import { Clapperboard, Flame, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CineSearchBar } from "@/components/cinematch/CineSearchBar";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/quiz", label: "Quiz" },
  { to: "/discover?section=trending", label: "Trending" },
  { to: "/discover?section=series", label: "Series" }
];

export function CineMatchNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-spotlight shadow-glow">
              <Clapperboard className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-2xl uppercase tracking-[0.28em] text-primary">CineMatch</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Hollywood Discovery Engine</p>
            </div>
          </Link>

          <Button asChild variant="heroSecondary" size="sm" className="lg:hidden">
            <Link to="/quiz">
              <Sparkles className="size-4" />
              Quiz
            </Link>
          </Button>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 transition duration-300 hover:bg-secondary/70 hover:text-foreground",
                  isActive ? "bg-secondary text-foreground shadow-poster" : ""
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <CineSearchBar className="w-full lg:w-[22rem]" />
          <div className="hidden gap-3 lg:flex">
            <Button asChild variant="heroSecondary" size="sm">
              <Link to="/discover?mode=random">
                <Flame className="size-4" />
                Surprise Me
              </Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="/quiz">
                <Sparkles className="size-4" />
                Start Movie Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
