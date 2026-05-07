import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  loadRestaurants,
  saveRestaurants,
  pickEmoji,
  type Restaurant,
} from "@/lib/storage";
import { RestaurantInput } from "@/components/RestaurantInput";
import { RestaurantList } from "@/components/RestaurantList";
import { ResultModal } from "@/components/ResultModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "wgft (we gettin' fat tonight)" },
      {
        name: "description",
        content:
          "Stop debating dinner. Add your favorite restaurants and let the roulette pick one for you.",
      },
    ],
  }),
});

function Index() {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);

  useEffect(() => {
    setItems(loadRestaurants());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveRestaurants(items);
  }, [items, hydrated]);

  const addItem = (name: string): string | null => {
    const exists = items.some(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return "That spot is already on your list 🙃";
    const next: Restaurant = {
      id: crypto.randomUUID(),
      name,
      emoji: pickEmoji(name),
    };
    setItems((prev) => [next, ...prev]);
    return null;
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((r) => r.id !== id));

  const clearAll = () => setItems([]);

  const choose = () => {
    if (items.length === 0) return;
    const pick = items[Math.floor(Math.random() * items.length)];
    setWinner(pick);
    setOpen(true);
  };

  const disabled = items.length === 0;

  const ctaLabel = useMemo(() => {
    if (items.length === 0) return "Add a restaurant to start";
    if (items.length === 1) return "Pick the only one 😄";
    return "Choose For Me";
  }, [items.length]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 80% 0%, oklch(0.78 0.18 55 / 0.35), transparent 60%), radial-gradient(50% 40% at 0% 20%, oklch(0.72 0.17 15 / 0.25), transparent 60%)",
        }}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍴</span>
            <span className="font-display text-sm font-bold tracking-wide">
              wgft (we gettin' fat tonight)
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Hero */}
        <section className="mt-10 sm:mt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            No more "I don't know, you pick"
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            What should <br className="hidden sm:block" />
            <span className="text-gradient">we eat tonight?</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Drop your favorite spots into the list. Hit the button. Let fate (and
            a dramatic spin) decide.
          </p>
        </section>

        {/* Card */}
        <section className="mt-8 space-y-5 rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur sm:p-6">
          <RestaurantInput onAdd={addItem} />
          <RestaurantList items={items} onRemove={removeItem} onClear={clearAll} />
        </section>

        {/* CTA */}
        <div className="sticky bottom-4 mt-8 sm:static sm:mt-10">
          <button
            onClick={choose}
            disabled={disabled}
            className="group relative w-full overflow-hidden rounded-3xl bg-hero py-5 font-display text-lg font-bold text-primary-foreground shadow-glow transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-soft"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 transition group-hover:rotate-12" />
              {ctaLabel}
            </span>
            {!disabled && (
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            )}
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Made with 🍕 — your list is saved on this device.
        </footer>
      </div>

      <ResultModal
        open={open}
        pool={items}
        winner={winner}
        onClose={() => setOpen(false)}
        onAgain={choose}
      />
    </main>
  );
}
