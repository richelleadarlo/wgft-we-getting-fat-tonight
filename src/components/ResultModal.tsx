import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Share2, RotateCcw, X } from "lucide-react";
import type { Restaurant } from "@/lib/storage";

type Props = {
  open: boolean;
  pool: Restaurant[];
  winner: Restaurant | null;
  onClose: () => void;
  onAgain: () => void;
};

export function ResultModal({ open, pool, winner, onClose, onAgain }: Props) {
  const [phase, setPhase] = useState<"spin" | "reveal">("spin");
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Names rotating during spin
  const cycle = useMemo(() => {
    if (pool.length === 0) return [];
    const arr = [...pool];
    // ensure at least 8 to cycle visually
    while (arr.length < 8) arr.push(...pool);
    return arr;
  }, [pool]);

  useEffect(() => {
    if (!open || !winner) return;
    setPhase("spin");
    setTick(0);

    let t = 0;
    let delay = 60;
    const step = () => {
      t++;
      setTick((x) => x + 1);
      delay += 18; // slow down
      if (t < 28) {
        intervalRef.current = window.setTimeout(step, delay);
      } else {
        setPhase("reveal");
        // Confetti burst
        const fire = (opts: confetti.Options) =>
          confetti({ origin: { y: 0.6 }, ...opts });
        fire({ particleCount: 80, spread: 70, startVelocity: 45 });
        setTimeout(() => fire({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } }), 150);
        setTimeout(() => fire({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }), 300);
      }
    };
    intervalRef.current = window.setTimeout(step, delay);

    return () => {
      if (intervalRef.current) window.clearTimeout(intervalRef.current);
    };
  }, [open, winner]);

  if (!open || !winner) return null;

  const displayed =
    phase === "spin" && cycle.length > 0
      ? cycle[tick % cycle.length]
      : winner;

  const share = async () => {
    const text = `Tonight we're eating at ${winner.emoji} ${winner.name}!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "What Should We Eat?", text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-hero px-8 pb-10 pt-12 text-center text-primary-foreground">
          <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">
            {phase === "spin" ? "Spinning the wheel..." : "Tonight's pick"}
          </p>

          <div className="mt-6 min-h-[160px]">
            {phase === "spin" ? (
              <div key={tick} className="animate-pop-in">
                <div className="text-6xl">{displayed.emoji}</div>
                <div className="mt-3 font-display text-2xl font-bold opacity-90">
                  {displayed.name}
                </div>
              </div>
            ) : (
              <div className="animate-pop-in">
                <div className="text-7xl drop-shadow-lg">{winner.emoji}</div>
                <div className="mt-3 font-display text-3xl font-extrabold leading-tight">
                  {winner.name}
                </div>
                <p className="mt-2 text-sm opacity-80">Bon appétit! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {phase === "reveal" && (
          <div className="flex gap-2 p-4 animate-pop-in">
            <button
              onClick={onAgain}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 font-semibold text-card-foreground transition hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Spin again
            </button>
            <button
              onClick={share}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 font-semibold text-background transition hover:opacity-90"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
