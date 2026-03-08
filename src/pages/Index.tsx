import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Film,
  Flame,
  Heart,
  Play,
  Rocket,
  Search,
  Sparkles,
  Star,
  Tv,
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
  { icon: Sparkles, title: "Smart Quiz", desc: "Answer 5 questions, get perfect recommendations", link: "/quiz" },
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
    <div className="flex gap-1.5 sm:gap-3 overflow-hidden pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="shrink-0 w-[80px] sm:w-[120px] lg:w-[140px]">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 mt-1 rounded" />
          <Skeleton className="h-2 w-1/2 mt-0.5 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── Lazy-loaded movie row — only fetches when visible ── */
function LazyMovieRow({ title, fetchFn, link, queryKey }: { title: string; fetchFn: () => Promise<any[]>; link: string; queryKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "200px" });

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 30,
    enabled: isVisible,
  });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1 sm:mb-3 px-0.5">
        <h2 className="text-xs sm:text-lg lg:text-xl font-bold text-foreground">{title}</h2>
        <Link to={link} className="flex items-center gap-0.5 text-[8px] sm:text-xs font-semibold text-muted-foreground hover:text-primary transition">
          See All <ChevronRight className="size-2.5 sm:size-4" />
        </Link>
      </div>
      {!isVisible || isLoading ? (
        <SkeletonRow />
      ) : data?.length ? (
        <div className="flex gap-1.5 sm:gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {data.slice(0, 15).map((item) => (
            <div key={item.imdbID} className="shrink-0 w-[80px] sm:w-[120px] lg:w-[170px] xl:w-[190px]">
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
    <div className="space-y-0.5">
      <p className="text-sm sm:text-xl lg:text-3xl font-black text-primary">{display}</p>
      <p className="text-[7px] sm:text-[10px] lg:text-sm text-muted-foreground font-medium">{label}</p>
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
  const sections = [
    { title: "🔥 Trending Now", fetchFn: () => fetchTmdbTrending(1), link: "/browse?cat=trending", queryKey: "home-trending" },
    { title: "🎬 Now Playing", fetchFn: () => fetchTmdbNowPlaying(1), link: "/browse?cat=nowplaying", queryKey: "home-nowplaying" },
    { title: "⭐ Top Rated", fetchFn: () => fetchTmdbTopRated(1), link: "/browse?cat=toprated", queryKey: "home-toprated" },
    { title: "🇮🇳 Bollywood", fetchFn: () => fetchTmdbBollywood(1), link: "/browse?cat=bollywood", queryKey: "home-bollywood" },
    { title: "🦸 Superhero", fetchFn: () => fetchTmdbSuperhero(1), link: "/browse?cat=superhero", queryKey: "home-superhero" },
    { title: "🌸 Anime", fetchFn: () => fetchTmdbAnime(1), link: "/browse?cat=anime", queryKey: "home-anime" },
    { title: "🚀 Sci-Fi", fetchFn: () => fetchTmdbSciFi(1), link: "/browse?cat=scifi", queryKey: "home-scifi" },
    { title: "👻 Horror", fetchFn: () => fetchTmdbHorror(1), link: "/browse?cat=horror", queryKey: "home-horror" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden h-[35vh] min-h-[220px] max-h-[820px] sm:h-[65vh] lg:h-[90vh]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative flex h-full items-end pb-8 sm:pb-16 lg:items-center lg:pb-0 px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl space-y-2 sm:space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/20 px-2 py-0.5 text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Now Streaming
            </div>
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-foreground">
              Discover Your<br />
              <span className="text-primary">Favourite Movies</span>
            </h1>
            <p className="max-w-md text-[10px] sm:text-sm lg:text-base leading-relaxed text-secondary-foreground hidden sm:block">
              Answer a quick quiz and get personalized movie picks from Hollywood, Bollywood, Anime, and more — plus full details, trailers, and where to watch.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Button asChild variant="hero" size="sm" className="sm:!h-11 sm:!px-6 sm:!text-sm lg:!h-13 lg:!px-8 lg:!text-base">
                <Link to="/quiz"><Play className="size-3.5 sm:size-4 lg:size-5 fill-current" /> Start Quiz</Link>
              </Button>
              <Button asChild variant="heroSecondary" size="sm" className="sm:!h-11 sm:!px-6 sm:!text-sm lg:!h-13 lg:!px-8 lg:!text-base">
                <Link to="/browse"><Film className="size-3.5 sm:size-4 lg:size-5" /> Browse All</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container px-3 sm:px-6 -mt-6 sm:-mt-12 lg:-mt-16 relative z-10">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-5">
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
                className="group flex flex-col items-center gap-1 sm:gap-3 lg:gap-4 rounded-lg lg:rounded-xl bg-card/80 backdrop-blur-md border border-border p-2 sm:p-5 lg:p-8 transition-all hover:bg-card hover:border-primary/30 hover:scale-[1.02] text-center"
              >
                <div className="flex size-6 sm:size-10 lg:size-14 items-center justify-center rounded-md lg:rounded-xl bg-primary/10">
                  <f.icon className="size-3 sm:size-5 lg:size-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-[8px] sm:text-sm lg:text-base font-bold text-foreground leading-tight">{f.title}</h3>
                  <p className="text-[7px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1 line-clamp-1 sm:line-clamp-2 hidden sm:block">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ MOVIE ROWS (horizontal scroll) ═══════════ */}
      <main className="container px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 lg:space-y-10 pt-6 sm:pt-12 lg:pt-16">
        {sections.map((s) => (
          <LazyMovieRow key={s.queryKey} title={s.title} fetchFn={s.fetchFn} link={s.link} queryKey={s.queryKey} />
        ))}
      </main>

      {/* ═══════════ PERSONALITY TYPES ═══════════ */}
      <section className="container px-3 sm:px-6 lg:px-8 py-6 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-foreground">What's Your Movie Type?</h2>
          <p className="text-[10px] sm:text-sm lg:text-base text-muted-foreground mt-0.5 lg:mt-2">Explore genres that match your vibe</p>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-5">
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
                className={`group flex flex-col items-center gap-1 sm:gap-2 lg:gap-3 rounded-xl bg-gradient-to-b ${p.color} border p-2 sm:p-5 lg:p-8 text-center transition-all hover:scale-105`}
              >
                <p.icon className={`size-4 sm:size-8 lg:size-12 ${p.iconColor}`} />
                <span className="text-[8px] sm:text-xs lg:text-sm font-bold text-foreground">{p.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FUN STATS ═══════════ */}
      <section className="container px-3 sm:px-6 lg:px-8 pb-4 sm:pb-10 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg lg:rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border px-3 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-14 text-center space-y-2 sm:space-y-4 lg:space-y-6"
        >
          <h2 className="text-sm sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground">
            Movies <span className="text-primary">DNA</span> in Numbers
          </h2>
          <StatsGrid />
          <p className="text-[8px] sm:text-xs lg:text-sm text-muted-foreground max-w-sm lg:max-w-lg mx-auto">
            Your perfect movie is one quiz away. Stop scrolling, start watching. 🍿
          </p>
          <Button asChild variant="hero" size="sm" className="group sm:!h-9 sm:!px-5 sm:!text-xs lg:!h-12 lg:!px-8 lg:!text-sm">
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
