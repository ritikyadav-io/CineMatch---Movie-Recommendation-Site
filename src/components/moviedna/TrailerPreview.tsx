import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Play, X } from "lucide-react";
import { useState } from "react";

import { fetchYouTubeTrailerId, getYouTubeEmbedUrl, getTrailerSearchUrl } from "@/lib/omdb";

const trailers = [
  { title: "Inception", year: "2010", genre: "Sci-Fi / Thriller" },
  { title: "The Dark Knight", year: "2008", genre: "Action / Crime" },
  { title: "Parasite", year: "2019", genre: "Thriller / Drama" },
  { title: "Your Name", year: "2016", genre: "Anime / Romance" },
  { title: "Dangal", year: "2016", genre: "Bollywood / Sport" },
  { title: "Spider-Man Into the Spider-Verse", year: "2018", genre: "Superhero / Animation" },
  { title: "Demon Slayer Mugen Train", year: "2020", genre: "Anime / Action" },
  { title: "3 Idiots", year: "2009", genre: "Bollywood / Comedy" },
];

function TrailerCard({ trailer, index }: { trailer: typeof trailers[number]; index: number }) {
  const [showPlayer, setShowPlayer] = useState(false);

  const { data: videoId, isLoading } = useQuery({
    queryKey: ["youtube-trailer", trailer.title, trailer.year],
    queryFn: () => fetchYouTubeTrailerId(trailer.title, trailer.year),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const handleClick = () => {
    if (videoId) {
      setShowPlayer(true);
    } else {
      window.open(getTrailerSearchUrl(trailer.title, trailer.year), "_blank");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        onClick={handleClick}
        className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 shadow-poster transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-glow"
      >
        {videoId ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={`${trailer.title} trailer thumbnail`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/30 transition-opacity duration-300 group-hover:bg-background/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/60 bg-background/60 text-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="size-6 fill-current" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-gradient-to-br from-muted via-card to-secondary">
            <div className="absolute inset-0 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="size-8 animate-spin text-primary" />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/60 bg-background/60 text-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Play className="size-6 fill-current" />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="space-y-1 p-5">
          <h3 className="text-lg font-semibold text-foreground">{trailer.title}</h3>
          <p className="text-sm text-muted-foreground">
            {trailer.year} • {trailer.genre}
          </p>
        </div>
      </motion.div>

      {/* Fullscreen video player modal */}
      {showPlayer && videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          onClick={() => setShowPlayer(false)}
        >
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute right-6 top-6 z-50 flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary"
            aria-label="Close trailer"
          >
            <X className="size-6" />
          </button>
          <div
            className="w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-glow">
              <iframe
                src={getYouTubeEmbedUrl(videoId)}
                className="h-full w-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={`${trailer.title} trailer`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
          Click any trailer to watch it instantly. No more guessing — see the vibe before you press play.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {trailers.map((trailer, index) => (
          <TrailerCard key={trailer.title} trailer={trailer} index={index} />
        ))}
      </div>
    </section>
  );
}
