import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
const SearchPage = lazy(() => import("./pages/Search"));
const TrailersPage = lazy(() => import("./pages/Trailers"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
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
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
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
