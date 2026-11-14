import type { ListingItem } from "./types";

/*
 * Product search over the cached product list (the catalog is small, so this
 * runs in memory; no search index needed yet).
 *
 * Every word of the query must appear somewhere in the product's text
 * (name, short spec, brand, category). Matches in the name rank higher.
 */

export type SearchableItem = ListingItem & { brandName?: string; categoryName?: string };

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const searchTerms = (query: string) => normalize(query).split(" ").filter(Boolean).slice(0, 8);

// Words shoppers use for the same thing. A search word matches if any of its alternatives does.
const SYNONYMS: string[][] = [
  ["charger", "adapter", "adaptor"],
  ["earbuds", "earbud", "earphone", "earphones", "headphone", "headphones", "airpods", "tws", "buds"],
  ["mic", "microphone", "mics", "microphones"],
  ["watch", "smartwatch", "watches"],
  ["speaker", "speakers", "boombox"],
  ["cover", "covers", "case", "cases"],
  ["tracker", "trackers", "airtag", "finder"],
];

const alternatives = (term: string) => SYNONYMS.find((group) => group.includes(term)) ?? [term];

export const searchProducts = (items: SearchableItem[], query: string) => {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];

  const scored = items.flatMap((item) => {
    const name = normalize(item.card.name);
    const rest = normalize(
      [item.card.spec, item.brandName ?? "", item.brandSlug ?? "", item.categoryName ?? "", item.categorySlug].join(" "),
    );
    let score = 0;
    for (const term of terms) {
      const options = alternatives(term);
      const inName = options.some((option) => name.includes(option));
      if (!inName && !options.some((option) => rest.includes(option))) return [];
      score += inName ? 3 : 1;
      if (name.split(" ").some((word) => word.startsWith(term))) score += 2;
    }
    if (name.startsWith(terms[0])) score += 3;
    if (item.card.inStock) score += 1;
    return [{ item, score }];
  });

  return scored
    .sort((a, b) => b.score - a.score || b.item.soldCount - a.item.soldCount)
    .map(({ item }) => item);
};
