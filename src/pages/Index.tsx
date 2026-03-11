import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Film,
  Flame,
  Heart,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  Star,
  Tv,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbNowPlaying,
  fetchTmdbTopRated,
  fetchTmdbHorror,
  fetchTmdbSciFi,
} from "@/lib/tmdb";

/* ── Feature cards data ── */
const features = [
  { icon: Star, title: "My Suggestions", desc: "Get a personalized top movie pick just for you", link: "/discover" },
  { icon: Search, title: "Deep Search", desc: "Find any movie by title, actor, or genre", link: "/search" },
  { icon: Tv, title: "Where to Watch", desc: "See which platform streams every movie", link: "/browse" },
  { icon: Zap, title: "Instant Details", desc: "Budget, cast, ratings, trailers — all in one tap", link: "/browse?cat=trending" },
];

/* ── Personality types ── */
const personalities = [
  { icon: Flame, title: "Action Addict", color: "from-orange-500/20 to-orange-600/5 border-orange-500/20", iconColor: "text-orange-400", link: "/browse?cat=action" },
  { icon: Heart, title: "Romantic", color: "from-pink-500/20 to-pink-600/5 border-pink-500/20", iconColor: "text-pink-400", link: "/browse?cat=romance" },
  { icon: Rocket, title: "Sci-Fi Explorer", color: "from-blue-500/20 to-blue-600/5 border-blue-500/20", iconColor: "text-blue-400", link: "/browse?cat=scifi" },
  { icon: Sparkles, title: "Anime Fan", color: "from-violet-500/20 to-violet-600/5 border-violet-500/20", iconColor: "text-violet-400", link: "/browse?cat=anime" },
  { icon: Clapperboard, title: "Bollywood Buff", color: "from-amber-500/20 to-amber-600/5 border-amber-500/20", iconColor: "text-amber-400", link: "/browse?cat=bollywood" },
  { icon: Film, title: "Horror Lover", color: "from-red-500/20 to-red-600/5 border-red-500/20", iconColor: "text-red-400", link: "/browse?cat=horror" },
];

/* ── Skeleton row placeholder ── */
function SkeletonRow() {
  return (
    <div className="flex gap-2.5 sm:gap-3 lg:gap-4 overflow-hidden pb-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shrink-0 w-[110px] sm:w-[130px] lg:w-[170px] xl:w-[190px]">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <Skeleton className="h-3.5 w-3/4 mt-1.5 rounded" />
          <Skeleton className="h-2.5 w-1/2 mt-1 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Fisher-Yates shuffle seeded by a number */
function shuffleArray<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ── Lazy-loaded movie row — only fetches when visible ── */
function LazyMovieRow({ title, fetchFn, link, queryKey, eager = false, seed }: { title: string; fetchFn: (page?: number) => Promise<any[]>; link: string; queryKey: string; eager?: boolean; seed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "200px" });

  // Random page derived from seed
  const randomPage = useMemo(() => {
    let s = seed + queryKey.charCodeAt(3);
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (Math.abs(s) % 5) + 1;
  }, [seed, queryKey]);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, seed],
    queryFn: () => fetchFn(randomPage),
    staleTime: 0,
    gcTime: 0,
    enabled: eager || isVisible,
  });

  // Shuffle results based on seed
  const displayed = useMemo(() => {
    if (!data?.length) return [];
    return shuffleArray(data, seed + queryKey.charCodeAt(5)).slice(0, 15);
  }, [data, seed, queryKey]);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-0.5">
        <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">{title}</h2>
        <Link to={link} className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-primary transition">
          See All <ChevronRight className="size-3.5 sm:size-4" />
        </Link>
      </div>
      {!isVisible || isLoading ? (
        <SkeletonRow />
      ) : displayed?.length ? (
        <div className="flex gap-2.5 sm:gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayed.map((item) => (
            <div key={item.imdbID} className="shrink-0 w-[110px] sm:w-[130px] lg:w-[170px] xl:w-[190px]">
              <CineMovieCard item={item} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1500, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

const statsData = [
  { target: 10000, suffix: "+", label: "Movies to Explore" },
  { target: 8, suffix: "", label: "Genre Universes" },
  { target: 50, suffix: "+", label: "Countries Covered" },
  { target: 0, suffix: "∞", label: "Movie Nights Saved" },
];

function AnimatedStat({ target, suffix, label, inView }: { target: number; suffix: string; label: string; inView: boolean }) {
  const count = useCountUp(target, target > 100 ? 2000 : 1200, inView);
  const display = target === 0 ? suffix : `${count.toLocaleString()}${suffix}`;
  return (
    <div className="space-y-1">
      <p className="text-lg sm:text-xl lg:text-3xl font-black text-primary">{display}</p>
      <p className="text-[10px] sm:text-[11px] lg:text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function StatsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 max-w-2xl lg:max-w-4xl mx-auto">
      {statsData.map((s) => (
        <AnimatedStat key={s.label} {...s} inView={inView} />
      ))}
    </div>
  );
}

/* ── Main page ── */
const Index = () => {
  const [seed, setSeed] = useState(() => Date.now());
  const [isSpinning, setIsSpinning] = useState(false);
  const queryClient = useQueryClient();

  const handleShuffle = () => {
    setIsSpinning(true);
    setSeed(Date.now());
    queryClient.removeQueries({ predicate: (q) => (q.queryKey[0] as string)?.startsWith("home-") });
    setTimeout(() => setIsSpinning(false), 600);
  };

  const sections = [
    { title: "🔥 Trending Now", fetchFn: fetchTmdbTrending, link: "/browse?cat=trending", queryKey: "home-trending" },
    { title: "🎬 Now Playing", fetchFn: fetchTmdbNowPlaying, link: "/browse?cat=nowplaying", queryKey: "home-nowplaying" },
    { title: "⭐ Top Rated", fetchFn: fetchTmdbTopRated, link: "/browse?cat=toprated", queryKey: "home-toprated" },
    { title: "🇮🇳 Bollywood", fetchFn: fetchTmdbBollywood, link: "/browse?cat=bollywood", queryKey: "home-bollywood" },
    { title: "🦸 Superhero", fetchFn: fetchTmdbSuperhero, link: "/browse?cat=superhero", queryKey: "home-superhero" },
    { title: "🌸 Anime", fetchFn: fetchTmdbAnime, link: "/browse?cat=anime", queryKey: "home-anime" },
    { title: "🚀 Sci-Fi", fetchFn: fetchTmdbSciFi, link: "/browse?cat=scifi", queryKey: "home-scifi" },
    { title: "👻 Horror", fetchFn: fetchTmdbHorror, link: "/browse?cat=horror", queryKey: "home-horror" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden h-[28vh] min-h-[200px] max-h-[700px] sm:h-[50vh] lg:h-[75vh]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative flex h-full items-end pb-4 sm:pb-12 lg:items-center lg:pb-0 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-lg space-y-1.5 sm:space-y-4"
          >
            <h1 className="text-lg sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-tight text-foreground">
              Discover Your<br />
              <span className="text-primary">Favourite Movies</span>
            </h1>
            <p className="max-w-sm text-[9px] sm:text-sm lg:text-base leading-relaxed text-secondary-foreground">
              Answer a quick quiz and get personalized movie picks from Hollywood, Bollywood, Anime, and more.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Button asChild variant="hero" size="sm" className="!h-7 !px-2.5 !text-[9px] sm:!h-10 sm:!px-5 sm:!text-sm lg:!h-12 lg:!px-7 lg:!text-base">
                <Link to="/quiz"><Play className="size-2.5 sm:size-4 lg:size-5 fill-current" /> Discover By Mood</Link>
              </Button>
              <Button asChild variant="heroSecondary" size="sm" className="!h-7 !px-2.5 !text-[9px] sm:!h-10 sm:!px-5 sm:!text-sm lg:!h-12 lg:!px-7 lg:!text-base">
                <Link to="/actresses"><Users className="size-2.5 sm:size-4 lg:size-5" /> Actresses</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container px-4 sm:px-6 -mt-6 sm:-mt-12 lg:-mt-16 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to={f.link}
                className="group flex flex-col items-center gap-1.5 sm:gap-3 lg:gap-4 rounded-md sm:rounded-lg lg:rounded-xl bg-card/80 backdrop-blur-md border border-border p-2 sm:p-5 lg:p-8 transition-all hover:bg-card hover:border-primary/30 hover:scale-[1.02] text-center"
              >
                <div className="flex size-7 sm:size-10 lg:size-14 items-center justify-center rounded sm:rounded-md lg:rounded-xl bg-primary/10">
                  <f.icon className="size-3.5 sm:size-5 lg:size-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-sm lg:text-base font-bold text-foreground leading-tight">{f.title}</h3>
                  <p className="text-[8px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1 line-clamp-2">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ MOVIE ROWS (horizontal scroll) ═══════════ */}
      <main className="container px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 lg:space-y-10 pt-8 sm:pt-12 lg:pt-16">
        <div className="flex items-center justify-end">
          <Button variant="outline" size="sm" onClick={handleShuffle} className="gap-1.5 text-xs">
            <RefreshCw className={`size-3.5 transition-transform duration-500 ${isSpinning ? "animate-spin" : ""}`} />
            Shuffle
          </Button>
        </div>
        {sections.map((s, i) => (
          <LazyMovieRow key={s.queryKey} title={s.title} fetchFn={s.fetchFn} link={s.link} queryKey={s.queryKey} eager={i < 2} seed={seed} />
        ))}
      </main>

      {/* ═══════════ PERSONALITY TYPES ═══════════ */}
      <section className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-foreground">What's Your Movie Type?</h2>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1 lg:mt-2">Explore genres that match your vibe</p>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3 lg:gap-5">
          {personalities.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <Link
                to={p.link}
                className={`group flex flex-col items-center gap-2 sm:gap-2 lg:gap-3 rounded-xl bg-gradient-to-b ${p.color} border p-3 sm:p-5 lg:p-8 text-center transition-all hover:scale-105`}
              >
                <p.icon className={`size-6 sm:size-8 lg:size-12 ${p.iconColor}`} />
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-foreground">{p.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FUN STATS ═══════════ */}
      <section className="container px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border px-4 py-6 sm:px-4 sm:py-8 lg:px-8 lg:py-14 text-center space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <h2 className="text-base sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground">
            Movies <span className="text-primary">DNA</span> in Numbers
          </h2>
          <StatsGrid />
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground max-w-sm lg:max-w-lg mx-auto">
            Your perfect movie is one quiz away. Stop scrolling, start watching. 🍿
          </p>
          <Button asChild variant="hero" size="default" className="group sm:!h-9 sm:!px-5 sm:!text-xs lg:!h-12 lg:!px-8 lg:!text-sm">
            <Link to="/quiz">
              Take the Quiz <ArrowRight className="size-3.5 lg:size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <DNAFooter />
    </div>
  );
};

export default Index;
