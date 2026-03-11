import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, Play, X } from "lucide-react";
import { useState } from "react";

import heroTrailers from "@/assets/hero-trailers.jpg";
import { DNANav } from "@/components/moviedna/DNANav";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
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
    if (videoId) {
      setShowPlayer(true);
    } else if (!isLoading) {
      window.open(getTrailerSearchUrl(trailer.title, trailer.year), "_blank");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border transition-all hover:border-primary/30 hover:scale-[1.02]"
        onClick={handleClick}
      >
        {videoId ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt={`${trailer.title} trailer thumbnail`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 group-hover:bg-background/10 transition">
              <div className="size-8 sm:size-10 rounded-full bg-primary/80 flex items-center justify-center">
                <Play className="size-3.5 sm:size-4 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {isLoading ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : <Play className="size-5 text-muted-foreground" />}
          </div>
        )}
        <div className="p-1.5 sm:p-2">
          <h3 className="text-[10px] sm:text-xs font-semibold text-foreground truncate">{trailer.title}</h3>
          <p className="text-[8px] sm:text-[10px] text-muted-foreground">{trailer.year} • {trailer.genre}</p>
        </div>
      </motion.div>

      {showPlayer && videoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm" onClick={() => setShowPlayer(false)}>
          <button onClick={() => setShowPlayer(false)} className="absolute right-4 top-4 z-50 rounded-full bg-secondary p-2 text-foreground hover:bg-muted" aria-label="Close">
            <X className="size-5" />
          </button>
          <div className="w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe src={getYouTubeEmbedUrl(videoId)} className="h-full w-full" allowFullScreen allow="autoplay; encrypted-media" title={`${trailer.title} trailer`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TrailersPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* Hero Banner */}
      <div className="relative h-32 sm:h-44 lg:h-52 overflow-hidden">
        <img src={heroTrailers} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="container relative flex items-end h-full pb-4 sm:pb-6 px-3 sm:px-6">
          <div>
            <h1 className="text-base sm:text-2xl font-black text-foreground">🎬 Trailers</h1>
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5">Preview before you watch</p>
          </div>
        </div>
      </div>

      <main className="container px-3 sm:px-6 pt-4 sm:pt-6 pb-8">

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {trailers.map((trailer, index) => (
            <TrailerCard key={trailer.title} trailer={trailer} index={index} />
          ))}
        </div>
      </main>

      <DNAFooter />
    </div>
  );
};

export default TrailersPage;
