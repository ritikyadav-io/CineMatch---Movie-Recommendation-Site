import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { TmdbMiniRow } from "@/components/moviedna/TmdbRows";
import { Button } from "@/components/ui/button";
import { defaultQuizAnswers, quizFieldsets } from "@/data/cinematchCatalog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { QuizAnswers } from "@/types/cinematch";

const QuizPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<QuizAnswers>(defaultQuizAnswers);

  const handleSubmit = async () => {
    const search = new URLSearchParams({ mode: "quiz", ...answers });

    // Save to DB if logged in
    if (user) {
      try {
        await supabase.from("quiz_results").insert({
          user_id: user.id,
          answers: answers as any,
        });
      } catch {
        // continue even if save fails
      }
    }

    navigate(`/discover?${search.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      <DNANav />
      <main className="container pt-16 pb-6 sm:pt-20 sm:pb-10 px-3 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-primary">Movies DNA Quiz</span>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">Decode Your Taste</h1>
            <p className="max-w-xl text-[9px] sm:text-xs text-muted-foreground">
              Pick your vibe across twelve questions and get a tailored watchlist.
            </p>
          </div>

          <div className="grid gap-2 sm:gap-3">
            {quizFieldsets.map((field) => (
              <section key={field.key} className="rounded-md bg-card/80 backdrop-blur-sm p-2.5 sm:p-3 space-y-1.5">
                <h2 className="text-[10px] sm:text-xs font-bold text-foreground">{field.label}</h2>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {field.options.map((option) => {
                    const isActive = answers[field.key as keyof QuizAnswers] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [field.key]: option as never }))}
                        className={[
                          "rounded px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-muted"
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="flex flex-col gap-2 rounded-md bg-card/80 backdrop-blur-sm p-2.5 sm:p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-foreground">Ready for your results?</p>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground">
                {user ? "Your results will be saved to your profile." : "Sign in to save your results."}
              </p>
            </div>
            <Button onClick={handleSubmit} variant="hero" size="sm" className="self-start text-[10px] sm:text-xs">
              <Sparkles className="size-3" />
              Show Recommendations
            </Button>
         </div>
        </div>
      </main>
      <DNAFooter />
    </div>
  );
};

export default QuizPage;
