import { motion } from "framer-motion";

import hollywoodImg from "@/assets/universe-hollywood.jpg";
import bollywoodImg from "@/assets/universe-bollywood.jpg";
import superheroImg from "@/assets/universe-superhero.jpg";
import animeImg from "@/assets/universe-anime.jpg";

const universes = [
  {
    title: "Hollywood Blockbusters",
    description: "Epic action, award-winning drama, and billion-dollar spectacles.",
    image: hollywoodImg,
    accent: "from-amber-600/60 to-transparent",
  },
  {
    title: "Bollywood Romance & Drama",
    description: "Sweeping love stories, vibrant musicals, and emotional sagas.",
    image: bollywoodImg,
    accent: "from-rose-600/60 to-transparent",
  },
  {
    title: "Superhero Movies",
    description: "Capes, cosmic battles, and interconnected cinematic universes.",
    image: superheroImg,
    accent: "from-blue-600/60 to-transparent",
  },
  {
    title: "Anime Adventures",
    description: "Hand-drawn magic, epic quests, and boundary-pushing animation.",
    image: animeImg,
    accent: "from-violet-600/60 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export function UniverseShowcase() {
  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Movie Universes</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
          Every World, One Platform
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          From Bollywood's golden palaces to anime's electric battlefields — Movie DNA spans every cinematic universe.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-6 sm:grid-cols-2"
      >
        {universes.map((universe) => (
          <motion.div
            key={universe.title}
            variants={cardVariants}
            className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/60 shadow-poster"
          >
            <img
              src={universe.image}
              alt={universe.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${universe.accent}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <h3 className="font-display text-3xl uppercase tracking-[0.06em] text-foreground lg:text-4xl">
                {universe.title}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{universe.description}</p>
            </div>

            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border-2 border-primary/0 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-glow" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
