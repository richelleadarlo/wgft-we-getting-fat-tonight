import { X, Trash2 } from "lucide-react";
import type { Restaurant } from "@/lib/storage";

type Props = {
  items: Restaurant[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function RestaurantList({ items, onRemove, onClear }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <div className="mb-3 text-5xl animate-float">🍽️</div>
        <p className="font-display text-lg font-semibold">Your list is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a few restaurants and we'll pick one for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-muted-foreground">
          {items.length} {items.length === 1 ? "spot" : "spots"} on the list
        </p>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Clear all
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 animate-pop-in"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-warm text-xl">
              {r.emoji}
            </span>
            <span className="flex-1 truncate font-medium text-card-foreground">
              {r.name}
            </span>
            <button
              onClick={() => onRemove(r.id)}
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove ${r.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
