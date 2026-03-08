import { Download, X } from "lucide-react";
import { useState } from "react";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";

export function InstallBanner() {
  const { canInstall, isInstalled, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 shadow-lg shadow-primary/30">
        <Download className="size-4 text-primary-foreground" />
        <span className="text-xs font-semibold text-primary-foreground whitespace-nowrap">
          Install Movies DNA
        </span>
        <Button
          onClick={install}
          size="sm"
          className="!h-6 !px-3 !text-[10px] rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Install
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded-full text-primary-foreground/70 hover:text-primary-foreground transition"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
