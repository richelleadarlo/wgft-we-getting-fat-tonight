import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";

type Props = {
  onAdd: (name: string) => string | null; // returns error message or null
};

export function RestaurantInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Type a restaurant name first 🍽️");
      return;
    }
    const err = onAdd(trimmed);
    if (err) {
      setError(err);
      return;
    }
    setValue("");
    setError(null);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
          placeholder="Add a restaurant... e.g. Sushi Palace"
          className="flex-1 rounded-2xl border border-border bg-card px-5 py-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:shadow-soft"
          maxLength={60}
        />
        <button
          type="submit"
          className="group flex items-center gap-2 rounded-2xl bg-hero px-5 py-4 font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow active:scale-[0.97]"
          aria-label="Add restaurant"
        >
          <Plus className="h-5 w-5 transition group-hover:rotate-90" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
      {error && (
        <p className="mt-2 px-1 text-sm text-destructive animate-pop-in">{error}</p>
      )}
    </form>
  );
}
