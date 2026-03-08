import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "@/hooks/use-auth";

import AuthPage from "./pages/Auth";
import BrowsePage from "./pages/Browse";
import DiscoverPage from "./pages/Discover";
import Index from "./pages/Index";
import MovieDetailPage from "./pages/MovieDetail";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/Privacy";
import ProfilePage from "./pages/Profile";
import QuizPage from "./pages/Quiz";
import SearchPage from "./pages/Search";
import TrailersPage from "./pages/Trailers";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
