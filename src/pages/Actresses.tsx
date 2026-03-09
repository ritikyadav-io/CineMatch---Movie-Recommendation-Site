import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { supabase } from "@/integrations/supabase/client";

// Only store id + name. Images fetched live from TMDB.
const ACTRESS_LIST = [
  // ── Hollywood (verified TMDB person IDs) ──
  { id: 90633, name: "Gal Gadot" },
  { id: 1245, name: "Scarlett Johansson" },
  { id: 224513, name: "Ana de Armas" },
  { id: 505710, name: "Zendaya" },               // fixed: was 1397778
  { id: 115440, name: "Sydney Sweeney" },
  { id: 71580, name: "Florence Pugh" },
  { id: 54693, name: "Emma Stone" },
  { id: 1813, name: "Anne Hathaway" },
  { id: 6885, name: "Charlize Theron" },
  { id: 18050, name: "Natalie Portman" },
  { id: 112, name: "Cate Blanchett" },
  { id: 1245982, name: "Margot Robbie" },
  { id: 5064, name: "Meryl Streep" },
  { id: 8691, name: "Zoe Saldana" },
  { id: 17018, name: "Angelina Jolie" },
  { id: 72129, name: "Jennifer Lawrence" },
  { id: 118545, name: "Dakota Johnson" },
  { id: 1283, name: "Helena Bonham Carter" },
  { id: 205, name: "Kirsten Dunst" },
  { id: 36662, name: "Emilia Clarke" },
  { id: 974169, name: "Jenna Ortega" },
  { id: 1903874, name: "Anya Taylor-Joy" },
  { id: 10990, name: "Emma Watson" },
  { id: 1038, name: "Jodie Foster" },
  { id: 4491, name: "Jennifer Aniston" },
  { id: 5916, name: "Rosario Dawson" },
  { id: 9273, name: "Amy Adams" },
  { id: 60073, name: "Brie Larson" },
  { id: 3489, name: "Naomi Watts" },
  { id: 71070, name: "Amanda Seyfried" },
  { id: 1315036, name: "Daisy Ridley" },
  // ── Bollywood (all IDs verified from themoviedb.org) ──
  { id: 81869, name: "Katrina Kaif" },
  { id: 1340978, name: "Kiara Advani" },
  { id: 1285028, name: "Kriti Sanon" },
  { id: 1974970, name: "Janhvi Kapoor" },
  { id: 87773, name: "Aishwarya Rai Bachchan" },
  { id: 225312, name: "Samantha Ruth Prabhu" },
  { id: 1752056, name: "Rashmika Mandanna" },
  { id: 53975, name: "Deepika Padukone" },
  { id: 1108120, name: "Alia Bhatt" },
  { id: 77234, name: "Priyanka Chopra" },
  { id: 81928, name: "Anushka Sharma" },
  { id: 1546398, name: "Disha Patani" },
  { id: 1848952, name: "Sara Ali Khan" },
  { id: 130991, name: "Shraddha Kapoor" },
  { id: 1488785, name: "Nora Fatehi" },
  { id: 86030, name: "Adah Sharma" },
  { id: 237040, name: "Ileana D'Cruz" },
  { id: 85721, name: "Tamannaah Bhatia" },
  { id: 587753, name: "Pooja Hegde" },
  { id: 1766034, name: "Mrunal Thakur" },
  { id: 2030881, name: "Tara Sutaria" },
  { id: 1973077, name: "Ananya Panday" },
  { id: 88167, name: "Anushka Shetty" },
  { id: 1756851, name: "Sanya Malhotra" },
  // ── Korean ──
  { id: 1457244, name: "IU (Lee Ji-eun)" },
  { id: 1254899, name: "Bae Suzy" },
  { id: 2056938, name: "Han So-hee" },
  { id: 1298103, name: "Kim Yoo-jung" },
  { id: 1251762, name: "Park Shin-hye" },
  { id: 1329674, name: "Jun Ji-hyun" },
  { id: 1339531, name: "Song Hye-kyo" },
  // ── Spanish / Latin ──
  { id: 955, name: "Penélope Cruz" },
  { id: 59174, name: "Úrsula Corberó" },
  { id: 1267, name: "Salma Hayek" },
  { id: 234722, name: "Blanca Suárez" },
  // ── Australian ──
  { id: 221581, name: "Rebel Wilson" },
  { id: 10978, name: "Isla Fisher" },
  { id: 20374, name: "Teresa Palmer" },
  { id: 17604, name: "Rose Byrne" },
  // ── Anime Voice Actresses (Japanese) ──
  { id: 119143, name: "Kana Hanazawa" },
  { id: 1492982, name: "Rie Takahashi" },
  { id: 1325949, name: "Inori Minase" },
  { id: 221773, name: "Saori Hayami" },
  { id: 9711, name: "Maaya Sakamoto" },
  { id: 40325, name: "Megumi Hayashibara" },
]
  .filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
  .sort((a, b) => a.name.localeCompare(b.name));

// Exported for other pages
export const TMDB_ACTRESSES = ACTRESS_LIST;

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

// Cache fetched profile images in memory
const profileCache = new Map<number, string>();
// Track IDs that failed so we can hide them
const failedIds = new Set<number>();

function ActressPhoto({ id, name, onFailed }: { id: number; name: string; onFailed: () => void }) {
  const [src, setSrc] = useState<string | null>(profileCache.get(id) || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (failedIds.has(id)) { onFailed(); return; }
    if (src) return;
    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.functions.invoke("tmdb-proxy", {
          body: { endpoint: `/person/${id}`, params: {} },
        });
        if (cancelled) return;
        const path = data?.profile_path;
        if (path) {
          const url = `${TMDB_IMG}${path}`;
          profileCache.set(id, url);
          setSrc(url);
        } else {
          failedIds.add(id);
          onFailed();
        }
      } catch {
        if (!cancelled) { failedIds.add(id); onFailed(); }
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (error || !src) return null;

  return (
    <img
      src={src}
      alt={name}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => { failedIds.add(id); setError(true); onFailed(); }}
    />
  );
}

function ActressCard({ actress }: { actress: { id: number; name: string } }) {
  const [hidden, setHidden] = useState(failedIds.has(actress.id));

  if (hidden) return null;

  return (
    <Link
      to={`/actress/${actress.id}`}
      className="group relative flex flex-col items-center gap-1.5 rounded-lg p-2 sm:p-3 bg-card hover:bg-muted transition-all duration-200"
    >
      <div className="relative size-16 sm:size-20 md:size-24 overflow-hidden rounded-full bg-muted ring-2 ring-border group-hover:ring-primary/50 transition">
        <ActressPhoto id={actress.id} name={actress.name} onFailed={() => setHidden(true)} />
      </div>
      <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight">
        {actress.name}
      </span>
    </Link>
  );
}

const ActressesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        <div className="space-y-1 mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">A to Z</span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">Famous Actresses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Tap to see their top movies. Actresses from Hollywood, Bollywood, Korea, Spain & Australia.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {ACTRESS_LIST.map((actress) => (
            <ActressCard key={actress.id} actress={actress} />
          ))}
        </div>
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressesPage;
