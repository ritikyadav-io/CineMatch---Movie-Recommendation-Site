import { Bell, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "@/assets/moviedna-logo.png";
import { Button } from "@/components/ui/button";
import { CineSearchBar } from "@/components/cinematch/CineSearchBar";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/quiz", label: "Quiz" },
  { to: "/discover?section=trending", label: "Trending" },
  { to: "/discover?section=series", label: "Series" },
  { to: "/discover?section=top-rated", label: "Top Rated" },
];

export function DNANav() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/95 shadow-lg backdrop-blur-md" : "bg-gradient-to-b from-background/80 to-transparent",
      ].join(" ")}
    >
      <div className="container flex items-center gap-6 py-3">
        {/* Logo */}
        <Link to="/" className="mr-4 shrink-0">
          <img src={logo} alt="Movie DNA" className="h-8 w-auto" />
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 rounded transition-colors duration-200 hover:text-foreground",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {showSearch ? (
            <CineSearchBar className="w-64 animate-fade-in" />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-muted-foreground transition hover:text-foreground"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
          )}
          <button className="p-2 text-muted-foreground transition hover:text-foreground hidden sm:block" aria-label="Notifications">
            <Bell className="size-5" />
          </button>
          <Button asChild variant="hero" size="sm">
            <Link to="/quiz">
              <Sparkles className="size-3.5" />
              Start Quiz
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
