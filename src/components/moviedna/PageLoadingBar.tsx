import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function PageLoadingBar() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5">
      <div className="h-full bg-primary animate-loading-bar rounded-r-full" />
    </div>
  );
}
