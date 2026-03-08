import { motion } from "framer-motion";
import {
  Clapperboard,
  Film,
  Flame,
  Ghost,
  Rocket,
  Sparkles,
  Star,
  Sword,
  Tv,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { label: "Trending", icon: Flame, to: "/browse?cat=trending" },
  { label: "Now Playing", icon: Film, to: "/browse?cat=nowplaying" },
  { label: "Top Rated", icon: Trophy, to: "/browse?cat=toprated" },
  { label: "Bollywood", icon: Clapperboard, to: "/browse?cat=bollywood" },
  { label: "Superhero", icon: Sparkles, to: "/browse?cat=superhero" },
  { label: "Anime", icon: Star, to: "/browse?cat=anime" },
  { label: "Sci-Fi", icon: Rocket, to: "/browse?cat=scifi" },
  { label: "Horror", icon: Ghost, to: "/browse?cat=horror" },
  { label: "Action", icon: Sword, to: "/browse?cat=action" },
  { label: "TV Series", icon: Tv, to: "/browse?cat=series" },
];

export function CategoryBar() {
  return (
    <section className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="scroll-row gap-3 pb-1"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              to={cat.to}
              className="flex shrink-0 flex-col items-center gap-2 rounded-xl bg-card px-5 py-4 transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-105 group min-w-[90px]"
            >
              <cat.icon className="size-6 text-primary transition-colors group-hover:text-primary-foreground" />
              <span className="text-xs font-semibold text-foreground transition-colors group-hover:text-primary-foreground">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
