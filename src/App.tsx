import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import { AuthProvider } from "@/hooks/use-auth";
import { InstallBanner } from "@/components/moviedna/InstallBanner";
import { PageLoadingBar } from "@/components/moviedna/PageLoadingBar";

// Eagerly load the home page; lazy-load everything else
import Index from "./pages/Index";

const AuthPage = lazy(() => import("./pages/Auth"));
const BrowsePage = lazy(() => import("./pages/Browse"));
const DiscoverPage = lazy(() => import("./pages/Discover"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const QuizPage = lazy(() => import("./pages/Quiz"));
const ActressesPage = lazy(() => import("./pages/Actresses"));
const ActressDetailPage = lazy(() => import("./pages/ActressDetail"));
const SearchPage = lazy(() => import("./pages/Search"));
const TrailersPage = lazy(() => import("./pages/Trailers"));

// Prefetch map for route-based chunk preloading
export const routePrefetchMap: Record<string, () => Promise<any>> = {
  "/auth": () => import("./pages/Auth"),
  "/browse": () => import("./pages/Browse"),
  "/discover": () => import("./pages/Discover"),
  "/quiz": () => import("./pages/Quiz"),
  "/actresses": () => import("./pages/Actresses"),
  "/search": () => import("./pages/Search"),
  "/trailers": () => import("./pages/Trailers"),
  "/profile": () => import("./pages/Profile"),
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MovieDetailKeyWrapper() {
  const { imdbID } = useParams();
  return <MovieDetailPage key={imdbID} />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 min — data stays fresh longer
      gcTime: 1000 * 60 * 60, // 1 hour in cache
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // don't refetch if data exists
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <PageLoadingBar />
          <InstallBanner />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/actresses" element={<ActressesPage />} />
              <Route path="/actress/:actressId" element={<ActressDetailPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:imdbID" element={<MovieDetailKeyWrapper />} />
              <Route path="/trailers" element={<TrailersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
