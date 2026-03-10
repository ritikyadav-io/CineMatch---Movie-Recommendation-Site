import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Calendar, MapPin, Heart, Film, Tv, Clapperboard } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { fetchTmdbFullDetail } from "@/lib/tmdb-detail";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { TMDB_ACTRESSES } from "@/pages/Actresses";
import { ACTRESS_RELATIONSHIPS } from "@/data/actressRelationships";

interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  media_type: "movie" | "tv";
  character?: string;
}

interface ActressData {
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  also_known_as: string[];
  currentProjects: MediaItem[];
  movies: MediaItem[];
  tvShows: MediaItem[];
  totalMovies: number;
  totalTvShows: number;
  latestMovie: MediaItem | null;
}

async function fetchActressDetail(id: number): Promise<ActressData> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy`;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
  };

  // Fetch person info, movie credits, and TV credits in parallel
  const [personRes, movieCreditsRes, tvCreditsRes] = await Promise.all([
    fetch(url, { method: "POST", headers, body: JSON.stringify({ endpoint: `/person/${id}` }) }),
    fetch(url, { method: "POST", headers, body: JSON.stringify({ endpoint: `/person/${id}/movie_credits` }) }),
    fetch(url, { method: "POST", headers, body: JSON.stringify({ endpoint: `/person/${id}/tv_credits` }) }),
  ]);

  if (!personRes.ok) throw new Error("Failed to fetch");
  const [data, movieCredits, tvCredits] = await Promise.all([
    personRes.json(),
    movieCreditsRes.json(),
    tvCreditsRes.json(),
  ]);

  data.movie_credits = movieCredits;
  data.tv_credits = tvCredits;

  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const threeMonthsAhead = new Date(now);
  threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

  const mapMovie = (m: any) => ({
    id: m.id,
    title: m.title || m.name,
    poster_path: m.poster_path,
    release_date: m.release_date || m.first_air_date,
    vote_average: m.vote_average,
    media_type: (m.first_air_date ? "tv" : "movie") as "movie" | "tv",
    character: m.character || m.roles?.[0]?.character || "",
  });

  const allMovies = (data.movie_credits?.cast || []).map(mapMovie);
  const allTv = (data.tv_credits?.cast || []).map((m: any) => ({
    ...mapMovie(m),
    title: m.name || m.title,
    release_date: m.first_air_date,
    media_type: "tv" as const,
    character: m.roles?.[0]?.character || m.character || "",
  }));

  // Current projects: released in last 6 months OR upcoming within 3 months
  const isCurrent = (item: MediaItem) => {
    if (!item.release_date) return false;
    const rd = new Date(item.release_date);
    return rd >= sixMonthsAgo && rd <= threeMonthsAhead;
  };

  const currentProjects = [...allMovies, ...allTv]
    .filter(isCurrent)
    .filter((a, i, arr) => arr.findIndex(b => b.id === a.id && b.media_type === a.media_type) === i)
    .sort((a, b) => new Date(b.release_date || "").getTime() - new Date(a.release_date || "").getTime());

  const uniqueMovies = allMovies.filter((a: any, i: number, arr: any[]) => arr.findIndex((b: any) => b.id === a.id) === i);
  const uniqueTv = allTv.filter((a: any, i: number, arr: any[]) => arr.findIndex((b: any) => b.id === a.id) === i);
  const totalMovies = uniqueMovies.length;
  const totalTvShows = uniqueTv.length;

  // Latest movie: most recent by release date that has already been released
  const latestMovie = [...allMovies]
    .filter(m => m.release_date && new Date(m.release_date) <= now)
    .sort((a, b) => new Date(b.release_date || "").getTime() - new Date(a.release_date || "").getTime())[0] || null;

  const movies = allMovies
    .sort((a: any, b: any) => (b.vote_average || 0) * (b.vote_average || 0) + (b.popularity || 0) - ((a.vote_average || 0) * (a.vote_average || 0) + (a.popularity || 0)));

  const tvShows = allTv
    .filter((a: any, i: number, arr: any[]) => arr.findIndex((b: any) => b.id === a.id) === i)
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

  return {
    name: data.name,
    profile_path: data.profile_path,
    biography: data.biography || "",
    birthday: data.birthday,
    deathday: data.deathday,
    place_of_birth: data.place_of_birth,
    also_known_as: data.also_known_as || [],
    currentProjects,
    movies,
    tvShows,
    totalMovies,
    totalTvShows,
    latestMovie,
  };
}

function calcAge(birthday: string, deathday?: string | null): number {
  const end = deathday ? new Date(deathday) : new Date();
  const birth = new Date(birthday);
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
}

function MediaCard({ item }: { item: MediaItem }) {
  const queryClient = useQueryClient();
  const imdbID = item.media_type === "tv" ? `tmdb-tv-${item.id}` : `tmdb-${item.id}`;
  const linkPath = `/movie/${imdbID}`;

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["movie-detail", imdbID],
      queryFn: () => fetchTmdbFullDetail(item.id, item.media_type),
      staleTime: 1000 * 60 * 60,
    });
  }, [item.id, item.media_type, imdbID, queryClient]);

  return (
    <Link
      to={linkPath}
      onMouseEnter={prefetch}
      onTouchStart={prefetch}
      className="group relative overflow-hidden rounded-md bg-card transition-all duration-200 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
    >
      <div className="aspect-[2/3] bg-muted">
        {item.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-[10px]">No Poster</div>
        )}
      </div>
      <div className="p-1.5 sm:p-2 space-y-0.5">
        <h3 className="text-[10px] sm:text-xs font-semibold text-foreground line-clamp-2">{item.title}</h3>
        {item.character && (
          <p className="text-[8px] sm:text-[9px] text-primary line-clamp-1">as {item.character}</p>
        )}
        <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] text-muted-foreground">
          {item.release_date && <span>{item.release_date.slice(0, 4)}</span>}
          {item.vote_average ? <span>⭐ {item.vote_average.toFixed(1)}</span> : null}
        </div>
      </div>
    </Link>
  );
}

const INITIAL_SHOW = 12;

function CollapsibleMediaSection({ icon, title, totalCount, items, keyPrefix }: {
  icon: React.ReactNode;
  title: string;
  totalCount: number;
  items: MediaItem[];
  keyPrefix: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_SHOW);
  const hasMore = items.length > INITIAL_SHOW;

  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground mb-3">
        {icon}
        {title} <span className="text-xs font-normal text-muted-foreground">({totalCount} total)</span>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {visible.map((item) => (
          <MediaCard key={`${keyPrefix}-${item.id}`} item={item} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition"
        >
          {expanded ? `Show Less ▲` : `Show More (${items.length - INITIAL_SHOW} more) ▼`}
        </button>
      )}
    </section>
  );
}

const ActressDetailPage = () => {
  const { actressId } = useParams();
  const navigate = useNavigate();
  const numId = Number(actressId);
  const staticData = TMDB_ACTRESSES.find((a) => a.id === numId);

  const query = useQuery({
    queryKey: ["actress-detail-v2", numId],
    queryFn: () => fetchActressDetail(numId),
    staleTime: 1000 * 60 * 60,
    enabled: !!numId,
  });

  const d = query.data;
  const name = d?.name || staticData?.name || "Actress";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/actresses")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Back to Actresses
        </button>

        {query.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading...
          </div>
        ) : (
          <>
            {/* ── Hero / Bio ── */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
              {d?.profile_path && (
                <div className="shrink-0 mx-auto sm:mx-0">
                  <div className="size-28 sm:size-36 overflow-hidden rounded-full bg-muted ring-2 ring-primary/30">
                    <img
                      src={`https://image.tmdb.org/t/p/w342${d.profile_path}`}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Actress Profile</span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{name}</h1>
                </div>

                {/* Quick facts */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {d?.birthday && (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-primary" />
                      {new Date(d.birthday).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {" "}({calcAge(d.birthday, d.deathday)} yrs{d.deathday ? ", deceased" : ""})
                    </span>
                  )}
                  {d?.place_of_birth && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {d.place_of_birth}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-xs bg-card rounded-md px-2.5 py-1.5">
                    <Film className="size-3 text-primary" />
                    <span className="font-bold text-foreground">{d?.totalMovies || 0}</span>
                    <span className="text-muted-foreground">Movies</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-card rounded-md px-2.5 py-1.5">
                    <Tv className="size-3 text-primary" />
                    <span className="font-bold text-foreground">{d?.totalTvShows || 0}</span>
                    <span className="text-muted-foreground">TV Shows</span>
                  </div>
                </div>

                {/* Latest Movie */}
                {d?.latestMovie && (
                  <Link
                    to={`/movie/tmdb-${d.latestMovie.id}`}
                    className="flex items-center gap-2 bg-card rounded-md px-2.5 py-1.5 hover:bg-muted transition w-fit"
                  >
                    <span className="text-[10px] sm:text-xs text-primary font-semibold">🎬 Latest:</span>
                    <span className="text-[10px] sm:text-xs text-foreground font-medium">{d.latestMovie.title}</span>
                    {d.latestMovie.release_date && (
                      <span className="text-[9px] text-muted-foreground">({d.latestMovie.release_date.slice(0, 4)})</span>
                    )}
                  </Link>
                )}

                {/* Bio */}
                {d?.biography && (
                {(() => {
                    const [bioExpanded, setBioExpanded] = useState(false);
                    return (
                      <div>
                        <p className={`text-xs sm:text-sm text-muted-foreground leading-relaxed ${bioExpanded ? "" : "line-clamp-5"}`}>
                          {d.biography}
                        </p>
                        {d.biography.length > 300 && (
                          <button
                            onClick={() => setBioExpanded(!bioExpanded)}
                            className="mt-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
                          >
                            {bioExpanded ? "Show Less ▲" : "Show More ▼"}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                )}

                {/* Also known as */}
                {d?.also_known_as && d.also_known_as.length > 0 && (
                  <div className="text-[10px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Also known as: </span>
                    {d.also_known_as.slice(0, 4).join(", ")}
                  </div>
                )}

                {/* Relationships */}
                {(() => {
                  const rel = ACTRESS_RELATIONSHIPS[numId];
                  if (!rel) return null;
                  return (
                    <div className="space-y-1.5">
                      {rel.current && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Heart className="size-3 text-pink-500 fill-pink-500" />
                          <span className="font-semibold text-foreground">
                            {rel.current.type === "married" ? "Married to" : rel.current.type === "engaged" ? "Engaged to" : "Dating"}:
                          </span>
                          <span className="text-muted-foreground">{rel.current.name}</span>
                          {rel.current.since && <span className="text-muted-foreground/60">(since {rel.current.since})</span>}
                        </div>
                      )}
                      {rel.exes && rel.exes.length > 0 && (
                        <div className="flex items-start gap-1.5 text-xs">
                          <Heart className="size-3 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">Ex: </span>
                            <span className="text-muted-foreground">
                              {rel.exes.map((ex, i) => (
                                <span key={ex.name}>
                                  {ex.name}{ex.years ? ` (${ex.years})` : ""}{i < rel.exes!.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── Currently Working On ── */}
            {d?.currentProjects && d.currentProjects.length > 0 && (
              <section className="mb-8">
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground mb-1">
                  <Clapperboard className="size-4 text-primary" />
                  Recent Projects
                </h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">Recent & upcoming projects</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {d.currentProjects.map((item) => (
                    <MediaCard key={`cur-${item.media_type}-${item.id}`} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Movies ── */}
            {d?.movies && d.movies.length > 0 && (
              <CollapsibleMediaSection
                icon={<Film className="size-4 text-primary" />}
                title="Movies"
                totalCount={d.totalMovies}
                items={d.movies}
                keyPrefix="m"
              />
            )}

            {/* ── TV Shows ── */}
            {d?.tvShows && d.tvShows.length > 0 && (
              <CollapsibleMediaSection
                icon={<Tv className="size-4 text-primary" />}
                title="TV Shows & Series"
                totalCount={d.totalTvShows}
                items={d.tvShows}
                keyPrefix="tv"
              />
            )}
          </>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressDetailPage;