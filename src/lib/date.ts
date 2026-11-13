import { cacheLife } from "next/cache";

// Cached so it is allowed during prerendering (Cache Components forbids a bare `new Date()`).
export const getCurrentYear = async () => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};
