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
    <form onSubmit={handleSubmit} className={cn("group flex items-center gap-3 rounded-full border border-border/70 bg-card/85 px-4 py-2 shadow-poster backdrop-blur-sm transition duration-300 hover:border-primary/60", className)}>
      <Search className="size-4 text-primary" />
      <input
        aria-label="Search by title, actor, genre, or year"
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        placeholder="Search title, actor, genre, or year"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}
