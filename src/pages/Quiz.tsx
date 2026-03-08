import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
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
      <main className="container pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Movie DNA Quiz</span>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Decode Your Taste</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Pick your vibe across twelve questions — including Bollywood, superhero, and anime preferences — and let Movie DNA assemble a tailored watchlist.
            </p>
          </div>

          <div className="grid gap-4">
            {quizFieldsets.map((field) => (
              <section key={field.key} className="rounded-lg bg-card/80 backdrop-blur-sm p-5 space-y-3">
                <h2 className="text-sm font-bold text-foreground">{field.label}</h2>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((option) => {
                    const isActive = answers[field.key as keyof QuizAnswers] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [field.key]: option as never }))}
                        className={[
                          "rounded-md px-4 py-2 text-xs font-medium transition-all duration-200",
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

          <div className="flex flex-col gap-3 rounded-lg bg-card/80 backdrop-blur-sm p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Ready for your results?</p>
              <p className="text-xs text-muted-foreground">
                {user ? "Your results will be saved to your profile." : "Sign in to save your results."}
              </p>
            </div>
            <Button onClick={handleSubmit} variant="hero" size="xl">
              <Sparkles className="size-4" />
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
