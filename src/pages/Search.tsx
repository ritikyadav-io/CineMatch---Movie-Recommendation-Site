import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { findCatalogMatches } from "@/data/cinematchCatalog";
import { fetchOmdbBatch, searchOmdbTitles } from "@/lib/omdb";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

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

  const results = useMemo(() => {
    const merged = [...(catalogQuery.data || []), ...(titleQuery.data || [])];
    return merged.filter((item, index, array) => array.findIndex((candidate) => candidate.imdbID === item.imdbID) === index);
  }, [catalogQuery.data, titleQuery.data]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-8 pt-24 pb-12 lg:pt-28 lg:pb-16">
        <section>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Search</span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Search by movie title, actor, genre, or year.</p>
          {query && <p className="text-xs text-foreground mt-2">Showing results for <span className="text-primary">"{query}"</span></p>}
        </section>

        {catalogQuery.isLoading || titleQuery.isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            Searching...
          </div>
        ) : results.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {results.map((item) => (
              <CineMovieCard key={item.imdbID} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">No matches. Try a broader title, actor, genre, or year.</div>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default SearchPage;
