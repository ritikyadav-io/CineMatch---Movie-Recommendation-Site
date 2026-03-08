import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, User } from "lucide-react";
import { useState } from "react";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import {
  searchTmdb,
  searchTmdbPerson,
  fetchTmdbPersonMovies,
  tmdbProfileImage,
  TmdbPerson,
} from "@/lib/tmdb";

const SearchPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<TmdbPerson | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      setSelectedPerson(null);
    }
  };

  const tmdbQuery = useQuery({
    queryKey: ["search", "tmdb", query],
    queryFn: () => searchTmdb(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 20,
  });

  const personQuery = useQuery({
    queryKey: ["search", "person", query],
    queryFn: () => searchTmdbPerson(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 30,
  });

  const personMoviesQuery = useQuery({
    queryKey: ["search", "person-movies", selectedPerson?.id],
    queryFn: () => fetchTmdbPersonMovies(selectedPerson!.id),
    enabled: Boolean(selectedPerson),
    staleTime: 1000 * 60 * 30,
  });

  const results = tmdbQuery.data || [];
  const isLoading = tmdbQuery.isLoading;
  const actors = personQuery.data || [];
  const hasSearched = query.length > 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-8 pt-24 pb-12 lg:pt-28 lg:pb-16 px-4 sm:px-6">
        {/* ── Search Input Section ── */}
        <section className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Deep <span className="text-primary">Search</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter an actor, actress, or director name and get movie suggestions instantly.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. Shah Rukh Khan, Scarlett Johansson..."
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
            <Button type="submit" variant="hero" size="sm" className="!h-auto !px-5">
              Search
            </Button>
          </form>
        </section>

        {/* ── No search yet ── */}
        {!hasSearched && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Type a name above to discover their movies 🎬
          </div>
        )}

        {/* ── Actor/Actress matches ── */}
        {actors.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">🎭 People Found</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {actors.map((person) => {
                const img = tmdbProfileImage(person.profile_path);
                const isActive = selectedPerson?.id === person.id;
                return (
                  <button
                    key={person.id}
                    onClick={() => setSelectedPerson(isActive ? null : person)}
                    className={[
                      "shrink-0 flex items-center gap-3 rounded-lg p-3 transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-secondary border border-border",
                    ].join(" ")}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={person.name}
                        className="size-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold">{person.name}</p>
                      <p className={["text-xs", isActive ? "text-primary-foreground/70" : "text-muted-foreground"].join(" ")}>
                        {person.known_for?.slice(0, 2).map((m) => m.title || m.name).join(", ")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Movies by selected person ── */}
        {selectedPerson && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              Movies by <span className="text-primary">{selectedPerson.name}</span>
            </h2>
            {personMoviesQuery.isLoading ? (
              <div className="flex items-center justify-center gap-3 py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                Loading filmography...
              </div>
            ) : personMoviesQuery.data?.length ? (
              <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {personMoviesQuery.data.map((item) => (
                  <CineMovieCard key={item.imdbID} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No movies found.</p>
            )}
          </section>
        )}

        {/* ── Title search results ── */}
        {hasSearched && !selectedPerson && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">🎬 Movies & Shows</h2>
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                Searching...
              </div>
            ) : results.length ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {results.map((item) => (
                  <CineMovieCard key={item.imdbID} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                No matches. Try a different name or movie title.
              </div>
            )}
          </section>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default SearchPage;
