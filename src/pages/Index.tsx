import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Film,
  Flame,
  Heart,
  Loader2,
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

/* ── Horizontal scroll movie row ── */
function MovieScrollRow({ title, data, loading, link }: { title: string; data?: any[]; loading: boolean; link: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <h2 className="text-sm sm:text-lg font-bold text-foreground">{title}</h2>
        <Link to={link} className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-primary transition">
          See All <ChevronRight className="size-3 sm:size-4" />
        </Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary mr-2" /> Loading...
        </div>
      ) : data?.length ? (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data.slice(0, 10).map((item) => (
            <div key={item.imdbID} className="shrink-0 w-[90px] sm:w-[120px] lg:w-[140px]">
              <CineMovieCard item={item} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Main page ── */
const Index = () => {
  const trending = useQuery({ queryKey: ["home-trending"], queryFn: () => fetchTmdbTrending(1), staleTime: 1000 * 60 * 30 });
  const nowPlaying = useQuery({ queryKey: ["home-nowplaying"], queryFn: () => fetchTmdbNowPlaying(1), staleTime: 1000 * 60 * 30 });
  const topRated = useQuery({ queryKey: ["home-toprated"], queryFn: () => fetchTmdbTopRated(1), staleTime: 1000 * 60 * 30 });
  const bollywood = useQuery({ queryKey: ["home-bollywood"], queryFn: () => fetchTmdbBollywood(1), staleTime: 1000 * 60 * 30 });
  const superhero = useQuery({ queryKey: ["home-superhero"], queryFn: () => fetchTmdbSuperhero(1), staleTime: 1000 * 60 * 30 });
  const anime = useQuery({ queryKey: ["home-anime"], queryFn: () => fetchTmdbAnime(1), staleTime: 1000 * 60 * 30 });
  const scifi = useQuery({ queryKey: ["home-scifi"], queryFn: () => fetchTmdbSciFi(1), staleTime: 1000 * 60 * 30 });
  const horror = useQuery({ queryKey: ["home-horror"], queryFn: () => fetchTmdbHorror(1), staleTime: 1000 * 60 * 30 });

  const sections = [
    { title: "🔥 Trending Now", data: trending.data, loading: trending.isLoading, link: "/browse?cat=trending" },
    { title: "🎬 Now Playing", data: nowPlaying.data, loading: nowPlaying.isLoading, link: "/browse?cat=nowplaying" },
    { title: "⭐ Top Rated", data: topRated.data, loading: topRated.isLoading, link: "/browse?cat=toprated" },
    { title: "🇮🇳 Bollywood", data: bollywood.data, loading: bollywood.isLoading, link: "/browse?cat=bollywood" },
    { title: "🦸 Superhero", data: superhero.data, loading: superhero.isLoading, link: "/browse?cat=superhero" },
    { title: "🌸 Anime", data: anime.data, loading: anime.isLoading, link: "/browse?cat=anime" },
    { title: "🚀 Sci-Fi", data: scifi.data, loading: scifi.isLoading, link: "/browse?cat=scifi" },
    { title: "👻 Horror", data: horror.data, loading: horror.isLoading, link: "/browse?cat=horror" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden h-[85vh] min-h-[480px] max-h-[720px]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative flex h-full items-end pb-12 sm:pb-16 lg:items-center lg:pb-0 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl space-y-4 sm:space-y-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/20 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Now Streaming
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-foreground">
              Discover Your<br />
              <span className="text-primary">Movie DNA</span>
            </h1>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-secondary-foreground">
              Answer a quick quiz and get personalized movie picks from Hollywood, Bollywood, Anime, and more — plus full details, trailers, and where to watch.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button asChild variant="hero" size="sm" className="sm:!h-11 sm:!px-6 sm:!text-sm">
                <Link to="/quiz"><Play className="size-3.5 sm:size-4 fill-current" /> Start Quiz</Link>
              </Button>
              <Button asChild variant="heroSecondary" size="sm" className="sm:!h-11 sm:!px-6 sm:!text-sm">
                <Link to="/browse"><Film className="size-3.5 sm:size-4" /> Browse All</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container px-3 sm:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
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
                className="group flex flex-col gap-2 sm:gap-3 rounded-xl bg-card/80 backdrop-blur-md border border-border p-3 sm:p-5 transition-all hover:bg-card hover:border-primary/30 hover:scale-[1.02]"
              >
                <div className="flex size-8 sm:size-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="size-4 sm:size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ MOVIE ROWS (horizontal scroll) ═══════════ */}
      <main className="container px-3 sm:px-6 space-y-6 sm:space-y-8 pt-8 sm:pt-12">
        {sections.map((s) => (
          <MovieScrollRow key={s.title} title={s.title} data={s.data} loading={s.loading} link={s.link} />
        ))}
      </main>

      {/* ═══════════ PERSONALITY TYPES ═══════════ */}
      <section className="container px-3 sm:px-6 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-3xl font-black text-foreground">What's Your Movie Type?</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Explore genres that match your vibe</p>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
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
                className={`group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-b ${p.color} border p-3 sm:p-5 text-center transition-all hover:scale-105`}
              >
                <p.icon className={`size-6 sm:size-8 ${p.iconColor}`} />
                <span className="text-[10px] sm:text-xs font-bold text-foreground">{p.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ MADE BY ═══════════ */}
      <section className="container px-3 sm:px-6 pb-10 sm:pb-16">
        <div className="rounded-2xl bg-card/50 border border-border px-5 py-10 sm:py-14 text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Movie <span className="text-primary">DNA</span>
          </h2>
        </div>
      </section>

      <DNAFooter />
    </div>
  );
};

export default Index;
