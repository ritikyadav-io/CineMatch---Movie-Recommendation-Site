import { useQuery } from "@tanstack/react-query";
import { Loader2, X, User, Film, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CastBioModalProps {
  actorId: number;
  onClose: () => void;
}

interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  movie_credits?: { cast: { id: number; title: string; character: string; release_date: string; poster_path: string | null; vote_average: number }[] };
}

export const CastBioModal = ({ actorId, onClose }: CastBioModalProps) => {
  const { data: person, isLoading } = useQuery({
    queryKey: ["person-detail", actorId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("tmdb-proxy", {
        body: { endpoint: `/person/${actorId}`, params: { append_to_response: "movie_credits" } },
      });
      if (error) throw error;
      return data as PersonDetail;
    },
    staleTime: 1000 * 60 * 60,
  });

  const topMovies = person?.movie_credits?.cast
    ?.filter((m) => m.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className="mx-auto max-w-2xl my-4 sm:my-10 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 border-b border-border bg-secondary/50">
          <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
            {isLoading ? "Loading..." : person?.name}
          </h3>
          <button onClick={onClose} className="shrink-0 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground transition" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" /> Loading biography...
          </div>
        ) : person ? (
          <div className="p-3 sm:p-5 space-y-4">
            {/* Profile + Quick Info */}
            <div className="flex gap-3 sm:gap-4">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                  alt={person.name}
                  className="w-20 sm:w-28 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="flex w-20 sm:w-28 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <User className="size-8 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-1.5 min-w-0">
                <h2 className="text-sm sm:text-xl font-black text-foreground">{person.name}</h2>
                <p className="text-[10px] sm:text-xs text-primary font-semibold">{person.known_for_department}</p>
                {person.birthday && (
                  <p className="flex items-center gap-1 text-[9px] sm:text-xs text-muted-foreground">
                    <Calendar className="size-2.5 sm:size-3" />
                    {person.birthday}{person.deathday ? ` — ${person.deathday}` : ""}
                  </p>
                )}
                {person.place_of_birth && (
                  <p className="flex items-center gap-1 text-[9px] sm:text-xs text-muted-foreground">
                    <MapPin className="size-2.5 sm:size-3" />
                    <span className="truncate">{person.place_of_birth}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Biography */}
            {person.biography && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-foreground mb-1">Biography</h4>
                <p className="text-[10px] sm:text-xs leading-relaxed text-secondary-foreground whitespace-pre-line">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Known For */}
            {topMovies && topMovies.length > 0 && (
              <div>
                <h4 className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-foreground mb-2">
                  <Film className="size-3" /> Top Movies
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {topMovies.map((m) => (
                    <a
                      key={m.id}
                      href={`/movie/tmdb-${m.id}`}
                      className="shrink-0 w-[80px] sm:w-[100px] group"
                      onClick={onClose}
                    >
                      {m.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                          alt={m.title}
                          className="w-full rounded-md border border-border group-hover:border-primary transition"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] rounded-md bg-muted flex items-center justify-center">
                          <Film className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-[8px] sm:text-[10px] font-medium text-foreground mt-1 truncate">{m.title}</p>
                      <p className="text-[7px] sm:text-[9px] text-muted-foreground truncate">{m.character}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
