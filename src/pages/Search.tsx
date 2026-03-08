import { useQuery } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { findCatalogMatches } from "@/data/cinematchCatalog";
import { fetchOmdbBatch, searchOmdbTitles } from "@/lib/omdb";
import {
  searchTmdb,
  searchTmdbPerson,
  fetchTmdbPersonMovies,
  tmdbProfileImage,
  TmdbPerson,
} from "@/lib/tmdb";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedPerson, setSelectedPerson] = useState<TmdbPerson | null>(null);

  const catalogMatches = findCatalogMatches(query);
  const catalogQuery = useQuery({
    queryKey: ["search", "catalog", query],
    queryFn: () => fetchOmdbBatch(catalogMatches.map((item) => item.imdbID)),
    enabled: catalogMatches.length > 0,
    staleTime: 1000 * 60 * 60,
  });

  const titleQuery = useQuery({
    queryKey: ["search", "titles", query],
    queryFn: () => searchOmdbTitles(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 20,
  });

  const tmdbQuery = useQuery({
    queryKey: ["search", "tmdb", query],
    queryFn: () => searchTmdb(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 20,
  });

  // Person/actor search
  const personQuery = useQuery({
    queryKey: ["search", "person", query],
    queryFn: () => searchTmdbPerson(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 30,
  });

  const personMoviesQuery = useQuery({
    queryKey: ["search", "person-movies", selectedPerson?.id],
    queryFn: () => fetchTmdbPersonMovies(selectedPerson!.id),
    enabled: Boolean(selectedPerson),
    staleTime: 1000 * 60 * 30,
  });

  const results = useMemo(() => {
    const merged = [
      ...(catalogQuery.data || []),
      ...(titleQuery.data || []),
      ...(tmdbQuery.data || []),
    ];
    return merged.filter(
      (item, index, array) =>
        array.findIndex((c) => c.imdbID === item.imdbID) === index
    );
  }, [catalogQuery.data, titleQuery.data, tmdbQuery.data]);

  const isLoading = catalogQuery.isLoading || titleQuery.isLoading || tmdbQuery.isLoading;
  const actors = personQuery.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-8 pt-24 pb-12 lg:pt-28 lg:pb-16">
        <section>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Search</span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search by movie title, actor/actress name, genre, or year.
          </p>
          {query && (
            <p className="text-xs text-foreground mt-2">
              Showing results for <span className="text-primary">"{query}"</span>
            </p>
          )}
        </section>

        {/* Actor/Actress matches */}
        {actors.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">🎭 Actors & Actresses</h2>
            <div className="scroll-row gap-3">
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
                        : "bg-card hover:bg-secondary",
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

        {/* Movies by selected actor */}
        {selectedPerson && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              Movies starring <span className="text-primary">{selectedPerson.name}</span>
            </h2>
            {personMoviesQuery.isLoading ? (
              <div className="flex items-center justify-center gap-3 py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                Loading filmography...
              </div>
            ) : personMoviesQuery.data?.length ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {personMoviesQuery.data.map((item) => (
                  <CineMovieCard key={item.imdbID} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No movies found.</p>
            )}
          </section>
        )}

        {/* Title search results */}
        <section className="space-y-3">
          {!selectedPerson && (
            <>
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
                  No matches. Try a broader title, actor name, genre, or year.
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <DNAFooter />
    </div>
  );
};

export default SearchPage;
