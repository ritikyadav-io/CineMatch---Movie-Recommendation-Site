import { motion } from "framer-motion";
import { Play } from "lucide-react";

const trailers = [
  { title: "Inception", year: "2010", genre: "Sci-Fi / Thriller", searchQuery: "Inception+2010+official+trailer" },
  { title: "The Dark Knight", year: "2008", genre: "Action / Crime", searchQuery: "The+Dark+Knight+2008+official+trailer" },
  { title: "Parasite", year: "2019", genre: "Thriller / Drama", searchQuery: "Parasite+2019+official+trailer" },
  { title: "Your Name", year: "2016", genre: "Anime / Romance", searchQuery: "Your+Name+2016+official+trailer" },
];

export function TrailerPreview() {
  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Trailer Spotlight</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
          Preview Before You Commit
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Watch trailers before making your pick. No more guessing — see the vibe before you press play.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {trailers.map((trailer, index) => (
          <motion.a
            key={trailer.title}
            href={`https://www.youtube.com/results?search_query=${trailer.searchQuery}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 shadow-poster transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-glow"
          >
            {/* Placeholder poster area */}
            <div className="relative aspect-video bg-gradient-to-br from-muted via-card to-secondary">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/60 bg-background/60 text-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Play className="size-6 fill-current" />
                </div>
              </div>
            </div>
            <div className="space-y-1 p-5">
              <h3 className="text-lg font-semibold text-foreground">{trailer.title}</h3>
              <p className="text-sm text-muted-foreground">
                {trailer.year} • {trailer.genre}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
