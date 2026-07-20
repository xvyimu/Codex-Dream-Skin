/** Pure theme catalog budget admission (entries / member / total bytes). Used by injector.mjs. */

/** Inject catalog is for F6 cycling only; full library stays on disk for the picker. */
export const MAX_THEME_CATALOG_ENTRIES = 8;
/** Bound non-active art so personal libraries cannot push CDP evaluate near 4MB. */
export const MAX_THEME_CATALOG_BYTES = 1.6 * 1024 * 1024;
export const MAX_CATALOG_MEMBER_BYTES = 96 * 1024;

/**
 * Pure catalog budget admission (mirrors loadThemeCatalog `add` guards).
 * @param {{
 *   currentEntryCount: number,
 *   currentCatalogImageBytes: number,
 *   candidateImageBytes: number,
 *   requireFull?: boolean,
 *   maxEntries?: number,
 *   maxCatalogBytes?: number,
 *   maxMemberBytes?: number,
 * }} input
 * @returns {{
 *   accept: boolean,
 *   reason: "ok" | "max-entries" | "member-too-large" | "catalog-bytes",
 *   nextEntryCount: number,
 *   nextCatalogImageBytes: number,
 * }}
 */
export function evaluateCatalogMemberBudget(input) {
  const maxEntries = input.maxEntries ?? MAX_THEME_CATALOG_ENTRIES;
  const maxCatalogBytes = input.maxCatalogBytes ?? MAX_THEME_CATALOG_BYTES;
  const maxMemberBytes = input.maxMemberBytes ?? MAX_CATALOG_MEMBER_BYTES;
  const requireFull = Boolean(input.requireFull);
  const size = input.candidateImageBytes;
  const count = input.currentEntryCount;
  const used = input.currentCatalogImageBytes;

  if (count >= maxEntries) {
    return {
      accept: false,
      reason: "max-entries",
      nextEntryCount: count,
      nextCatalogImageBytes: used,
    };
  }
  if (!requireFull && size > maxMemberBytes) {
    return {
      accept: false,
      reason: "member-too-large",
      nextEntryCount: count,
      nextCatalogImageBytes: used,
    };
  }
  const nextBytes = used + size;
  if (count > 0 && nextBytes > maxCatalogBytes) {
    return {
      accept: false,
      reason: "catalog-bytes",
      nextEntryCount: count,
      nextCatalogImageBytes: used,
    };
  }
  return {
    accept: true,
    reason: "ok",
    nextEntryCount: count + 1,
    nextCatalogImageBytes: nextBytes,
  };
}
