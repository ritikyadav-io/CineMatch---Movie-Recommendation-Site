import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container py-12 lg:py-16">
        <section className="section-shell mx-auto max-w-4xl space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Privacy Policy</p>
          <h1 className="font-display text-5xl uppercase tracking-[0.08em]">Your data stays simple</h1>
          <p className="text-muted-foreground">Movie DNA currently uses your quiz selections and searches only to generate on-page recommendations. No account is required and no personal profile is stored in this version.</p>
          <p className="text-muted-foreground">Third-party movie data and poster assets are fetched from OMDb for title discovery and detail views.</p>
        </section>
      </main>
      <CineFooter />
    </div>
  );
};

export default PrivacyPage;
