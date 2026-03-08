import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { Button } from "@/components/ui/button";
import { defaultQuizAnswers, quizFieldsets } from "@/data/cinematchCatalog";
import { QuizAnswers } from "@/types/cinematch";

const QuizPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<QuizAnswers>(defaultQuizAnswers);

  const handleSubmit = () => {
    const search = new URLSearchParams({ mode: "quiz", ...answers });
    navigate(`/discover?${search.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container py-12 lg:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="section-shell space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">CineMatch Quiz</p>
            <h1 className="font-display text-5xl uppercase tracking-[0.08em] sm:text-6xl">Dial in your taste</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">Pick your vibe across nine quick questions and let CineMatch assemble a tailored watchlist.</p>
          </div>

          <div className="grid gap-6">
            {quizFieldsets.map((field) => (
              <section key={field.key} className="section-shell space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-primary">Question</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{field.label}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {field.options.map((option) => {
                    const isActive = answers[field.key as keyof QuizAnswers] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [field.key]: option as never }))}
                        className={[
                          "rounded-full border px-4 py-3 text-sm font-medium transition duration-300",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground shadow-glow"
                            : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
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

          <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Ready for your spotlight pick?</p>
              <p className="text-muted-foreground">We’ll rank the best matches and surface one top recommendation plus a backup row.</p>
            </div>
            <Button onClick={handleSubmit} variant="hero" size="xl">
              <Sparkles className="size-4" />
              Show My Recommendations
            </Button>
          </div>
        </div>
      </main>
      <CineFooter />
    </div>
  );
};

export default QuizPage;
