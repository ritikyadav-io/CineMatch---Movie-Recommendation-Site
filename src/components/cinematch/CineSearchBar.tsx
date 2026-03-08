import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

interface CineSearchBarProps {
  className?: string;
  initialValue?: string;
}

export function CineSearchBar({ className, initialValue = "" }: CineSearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-muted-foreground/50", className)}>
      <Search className="size-4 text-muted-foreground" />
      <input
        aria-label="Search by title, actor, genre, or year"
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        placeholder="Search title, actor, genre…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}
