export type Restaurant = { id: string; name: string; emoji: string };

const KEY = "wswe.restaurants.v1";
const THEME_KEY = "wswe.theme";

const FOOD_EMOJIS = ["🍕","🍔","🌮","🍣","🍜","🍝","🥗","🍱","🍛","🥘","🍤","🌯","🥙","🍖","🥟","🍦","🍩","🍰","🥐","🍳"];

export function pickEmoji(name: string): string {
  const n = name.toLowerCase();
  const map: Record<string, string> = {
    pizza: "🍕", burger: "🍔", sushi: "🍣", taco: "🌮", ramen: "🍜",
    pasta: "🍝", noodle: "🍜", korean: "🍱", indian: "🍛", thai: "🥘",
    chinese: "🥡", mexican: "🌮", japanese: "🍣", italian: "🍝",
    salad: "🥗", bbq: "🍖", grill: "🍖", dumpling: "🥟", cafe: "☕",
    coffee: "☕", bakery: "🥐", dessert: "🍰", ice: "🍦",
  };
  for (const k in map) if (n.includes(k)) return map[k];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return FOOD_EMOJIS[h % FOOD_EMOJIS.length];
}

export function loadRestaurants(): Restaurant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export function saveRestaurants(list: Restaurant[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const t = localStorage.getItem(THEME_KEY);
  if (t === "dark" || t === "light") return t;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(t: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, t);
}
