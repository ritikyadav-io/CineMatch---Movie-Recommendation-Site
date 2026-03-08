import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { CategoryBar } from "@/components/moviedna/CategoryBar";
import { CTASection } from "@/components/moviedna/CTASection";
import { CoupleMode } from "@/components/moviedna/CoupleMode";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNAHero } from "@/components/moviedna/DNAHero";
import { DNANav } from "@/components/moviedna/DNANav";
import { FeatureCards } from "@/components/moviedna/FeatureCards";
import { MoviePersonality } from "@/components/moviedna/MoviePersonality";
import { QuizPreview } from "@/components/moviedna/QuizPreview";
import { TrailerPreview } from "@/components/moviedna/TrailerPreview";
import { UniverseShowcase } from "@/components/moviedna/UniverseShowcase";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbSciFi,
  fetchTmdbTopRated,
  fetchTmdbHorror,
  fetchTmdbSeries,
  fetchTmdbNowPlaying,
} from "@/lib/tmdb";
import type { MediaCardData } from "@/types/cinematch";

const movieSections = [
  { title: "🔥 Trending Now", key: "tmdb-trending", fetcher: fetchTmdbTrending, link: "/browse?cat=trending" },
  { title: "🎬 Now Playing", key: "tmdb-nowplaying", fetcher: fetchTmdbNowPlaying, link: "/browse?cat=nowplaying" },
  { title: "⭐ Top Rated", key: "tmdb-toprated", fetcher: fetchTmdbTopRated, link: "/browse?cat=toprated" },
  { title: "🇮🇳 Bollywood", key: "tmdb-bollywood", fetcher: fetchTmdbBollywood, link: "/browse?cat=bollywood" },
  { title: "🦸 Superhero", key: "tmdb-superhero", fetcher: fetchTmdbSuperhero, link: "/browse?cat=superhero" },
  { title: "🌸 Anime", key: "tmdb-anime", fetcher: fetchTmdbAnime, link: "/browse?cat=anime" },
  { title: "🚀 Sci-Fi", key: "tmdb-scifi", fetcher: fetchTmdbSciFi, link: "/browse?cat=scifi" },
  { title: "👻 Horror", key: "tmdb-horror", fetcher: fetchTmdbHorror, link: "/browse?cat=horror" },
  { title: "📺 Trending Series", key: "tmdb-series", fetcher: fetchTmdbSeries, link: "/browse?cat=series" },
];

function HomeMovieRow({ title, queryKey, fetcher, link }: { title: string; queryKey: string; fetcher: (p?: number) => Promise<MediaCardData[]>; link: string }) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <Link to={link} className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {data.slice(0, 5).map((item) => (
          <Link
            key={item.imdbID}
            to={`/movie/${item.imdbID}`}
            className="group relative overflow-hidden rounded-md bg-card transition-all duration-300 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-muted">
              <img
                src={item.poster}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="line-clamp-1 text-xs font-semibold text-foreground">{item.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{item.year}</p>
                </div>
                <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-semibold text-foreground">
                  <Star className="size-2.5 fill-yellow-500 text-yellow-500" />
                  {item.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main style={{ overflow: 'visible' }}>
        <DNAHero />
        <CategoryBar />
        
        {/* Movie Rows - inline to avoid layout collapse */}
        <div className="container space-y-10 py-10 lg:py-14">
          {movieSections.map((s) => (
            <HomeMovieRow key={s.key} title={s.title} queryKey={s.key} fetcher={s.fetcher} link={s.link} />
          ))}
        </div>

        <FeatureCards />
        <QuizPreview />
        <UniverseShowcase />
        <TrailerPreview />
        <CoupleMode />
        <MoviePersonality />
        <CTASection />
      </main>
      <DNAFooter />
    </div>
  );
};

export default Index;
