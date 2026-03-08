import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import hollywoodImg from "@/assets/universe-hollywood.jpg";
import bollywoodImg from "@/assets/universe-bollywood.jpg";
import superheroImg from "@/assets/universe-superhero.jpg";
import animeImg from "@/assets/universe-anime.jpg";

const universes = [
  {
    title: "Hollywood Blockbusters",
    subtitle: "Action • Drama • Sci-Fi",
    image: hollywoodImg,
    link: "/browse?cat=trending",
  },
  {
    title: "Bollywood Romance & Drama",
    subtitle: "Romance • Musical • Thriller",
    image: bollywoodImg,
    link: "/browse?cat=bollywood",
  },
  {
    title: "Superhero Movies",
    subtitle: "Marvel • DC • Animated",
    image: superheroImg,
    link: "/browse?cat=superhero",
  },
  {
    title: "Anime Adventures",
    subtitle: "Shonen • Fantasy • Psychological",
    image: animeImg,
    link: "/browse?cat=anime",
  },
];

export function UniverseShowcase() {
  return (
    <section className="container py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-foreground">Movie Universes</h2>
        <Link to="/discover" className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
          Explore All <ChevronRight className="size-4" />
        </Link>
      </motion.div>

      <div className="scroll-row gap-3 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        {universes.map((universe, index) => (
          <motion.div
            key={universe.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              to={universe.link}
              className="group relative block aspect-[16/9] w-72 overflow-hidden rounded-md lg:w-auto"
            >
              <img
                src={universe.image}
                alt={universe.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-primary/10" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-base font-bold text-foreground">{universe.title}</h3>
                <p className="text-xs text-muted-foreground">{universe.subtitle}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
