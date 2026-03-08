import { Bookmark, BookmarkCheck } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MediaCardData } from "@/types/cinematch";
import { useNavigate } from "react-router-dom";

interface WatchlistButtonProps {
  movie: MediaCardData;
  className?: string;
}

export function WatchlistButton({ movie, className = "" }: WatchlistButtonProps) {
  const { user } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, isAdding } = useWatchlist();
  const navigate = useNavigate();

  const inList = isInWatchlist(movie.imdbID);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (inList) {
      removeFromWatchlist(movie.imdbID);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className={[
        "rounded-full p-1.5 transition",
        inList
          ? "bg-primary text-primary-foreground"
          : "bg-background/70 text-foreground hover:bg-primary hover:text-primary-foreground",
        className,
      ].join(" ")}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
    >
      {inList ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
    </button>
  );
}
