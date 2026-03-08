import {
  ArrowLeft,
  Bell,
  Bookmark,
  Clapperboard,
  Compass,
  Download,
  Film,
  Flame,
  Heart,
  Home,
  Menu,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "@/assets/moviedna-logo.png";
import { Button } from "@/components/ui/button";
import { CineSearchBar } from "@/components/cinematch/CineSearchBar";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: Film },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/quiz", label: "Quiz", icon: Sparkles },
  { to: "/browse?cat=bollywood", label: "Bollywood", icon: Clapperboard },
  { to: "/browse?cat=anime", label: "Anime", icon: Flame },
];

export function DNANav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const { canInstall, isInstalled, install } = usePwaInstall();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  useEffect(() => {
    let lastY = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 80 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "bg-background/95 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-b from-background/80 to-transparent",
        ].join(" ")}
      >
        <div className="container flex items-center gap-4 py-3">
          {/* Mobile: Back button or Hamburger */}
          <div className="flex lg:hidden">
            {!isHome ? (
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
            ) : (
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            )}
          </div>

          {/* Logo */}
          <Link to="/" className="shrink-0 text-sm sm:text-lg font-black tracking-tight text-foreground">
            Movie <span className="text-primary">DNA</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm ml-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "px-3 py-1.5 rounded transition-colors duration-200 hover:text-foreground",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {showSearch ? (
              <CineSearchBar className="w-48 sm:w-64 animate-fade-in" />
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
            )}
            <button
              className="p-2 text-muted-foreground transition hover:text-foreground hidden sm:block"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>

            {canInstall && !isInstalled && (
              <Button
                onClick={install}
                variant="heroSecondary"
                size="sm"
                className="hidden sm:flex"
              >
                <Download className="size-3.5" />
                Install App
              </Button>
            )}

            {user ? (
              <Link
                to="/profile"
                className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary transition hover:bg-primary hover:text-primary-foreground"
                aria-label="Profile"
              >
                <User className="size-4" />
              </Link>
            ) : (
              <Button asChild variant="hero" size="sm" className="hidden sm:flex">
                <Link to="/auth">
                  <LogIn className="size-3.5" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile hamburger (shown on non-home pages too) */}
            {isHome ? null : (
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-muted-foreground transition hover:text-foreground lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-card shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-black tracking-tight text-foreground">Movie <span className="text-primary">DNA</span></span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to.includes("?") &&
                    location.pathname + location.search === item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-border my-3" />

              <Link
                to="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                <Search className="size-5" />
                Search
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
                >
                  <Bookmark className="size-5" />
                  My Profile & Watchlist
                </Link>
              )}
            </nav>

            {/* Bottom actions */}
            <div className="p-4 space-y-2 border-t border-border">
              {canInstall && !isInstalled && (
                <Button
                  onClick={() => {
                    install();
                    setMobileOpen(false);
                  }}
                  variant="heroSecondary"
                  className="w-full"
                >
                  <Download className="size-4" />
                  Install App
                </Button>
              )}
              {user ? (
                <Button asChild variant="hero" className="w-full">
                  <Link to="/quiz" onClick={() => setMobileOpen(false)}>
                    <Sparkles className="size-4" />
                    Start Quiz
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="hero" className="w-full">
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>
                    <LogIn className="size-4" />
                    Sign In / Sign Up
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
