/*
 * Shop categories, in display order.
 * TEMPORARY: categories move to MongoDB (admin can add / edit / reorder) in a
 * later stage. `shortName` is the label used in tight spots (category nav,
 * category tiles), as in the mockup.
 */
export type NavCategory = {
  name: string;
  shortName: string;
  slug: string;
};

export const categories: NavCategory[] = [
  { name: "Earbuds", shortName: "Earbuds", slug: "earbuds" },
  { name: "Earbud covers", shortName: "Covers", slug: "earbud-covers" },
  { name: "Speakers", shortName: "Speakers", slug: "speakers" },
  { name: "Karaoke", shortName: "Karaoke", slug: "karaoke" },
  { name: "Microphones", shortName: "Mics", slug: "microphones" },
  { name: "Smart watches", shortName: "Watches", slug: "smart-watches" },
  { name: "Trackers", shortName: "Trackers", slug: "trackers" },
  { name: "Adapters", shortName: "Adapters", slug: "adapters" },
  { name: "Chargers", shortName: "Chargers", slug: "chargers" },
];
