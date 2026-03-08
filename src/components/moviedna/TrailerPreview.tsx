import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, Play, X } from "lucide-react";
import { useState } from "react";

import { fetchYouTubeTrailerId, getYouTubeEmbedUrl, getTrailerSearchUrl } from "@/lib/omdb";

const trailers = [
  { title: "Inception", year: "2010", genre: "Sci-Fi" },
  { title: "The Dark Knight", year: "2008", genre: "Action" },
  { title: "Parasite", year: "2019", genre: "Thriller" },
  { title: "Your Name", year: "2016", genre: "Anime" },
  { title: "Dangal", year: "2016", genre: "Bollywood" },
  { title: "Spider-Man Into the Spider-Verse", year: "2018", genre: "Superhero" },
  { title: "Demon Slayer Mugen Train", year: "2020", genre: "Anime" },
  { title: "3 Idiots", year: "2009", genre: "Bollywood" },
];

function TrailerCard({ trailer, index }: { trailer: typeof trailers[number]; index: number }) {
  const [showPlayer, setShowPlayer] = useState(false);

  const { data: videoId, isLoading } = useQuery({
    queryKey: ["youtube-trailer", trailer.title, trailer.year],
    queryFn: () => fetchYouTubeTrailerId(trailer.title, trailer.year),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const handleClick = () => {
    if (videoId) setShowPlayer(true);
    else window.open(getTrailerSearchUrl(trailer.title, trailer.year), "_blank");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        onClick={handleClick}
        className="group cursor-pointer w-64 shrink-0 lg:w-auto overflow-hidden rounded-md bg-card transition-all duration-300 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
      >
        {videoId ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={`${trailer.title} trailer`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 transition group-hover:bg-background/10">
              <div className="flex size-12 items-center justify-center rounded-full bg-background/80 text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="size-5 fill-current" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {isLoading ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : <Play className="size-8 text-muted-foreground" />}
          </div>
        )}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-foreground truncate">{trailer.title}</h3>
          <p className="text-xs text-muted-foreground">{trailer.year} • {trailer.genre}</p>
        </div>
      </motion.div>

      {showPlayer && videoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm" onClick={() => setShowPlayer(false)}>
          <button onClick={() => setShowPlayer(false)} className="absolute right-4 top-4 z-50 rounded-full bg-secondary p-2 text-foreground hover:bg-muted" aria-label="Close">
            <X className="size-5" />
          </button>
          <div className="w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe src={getYouTubeEmbedUrl(videoId)} className="h-full w-full" allowFullScreen allow="autoplay; encrypted-media" title={`${trailer.title} trailer`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TrailerPreview() {
  return (
    <section className="container py-12 lg:py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Trailers</h2>
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          Preview Before You Watch <ChevronRight className="size-4" />
        </span>
      </div>

      <div className="scroll-row gap-3 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        {trailers.map((trailer, index) => (
          <TrailerCard key={trailer.title} trailer={trailer} index={index} />
        ))}
      </div>
    </section>
  );
}
