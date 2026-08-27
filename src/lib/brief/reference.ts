/**
 * Ids and human-quotable references for stored briefs.
 *
 * Deliberately free of `server-only` and of any I/O, so the collision
 * behaviour can be tested directly.
 */

export function newBriefId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Node < 19 without global crypto, and non-secure browser contexts.
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

/**
 * Short code the team and the customer can quote: `KMC-4F2A9C1B3D`.
 *
 * Ten hex characters, not six. Six gives 16.7M values, and by the birthday
 * bound that is a ~3% chance of a collision by 1,000 leads and ~50% by 4,800 —
 * and `reference` is unique in the database, so a collision means a rejected
 * insert and a lost lead. Ten characters push the same 50% point past a
 * million records. `saveBrief` still retries once, because "unlikely" is not
 * "impossible".
 */
export function referenceFrom(id: string): string {
  const hex = id.replace(/[^0-9a-f]/gi, "");
  return `KMC-${hex.slice(0, 10).toUpperCase().padEnd(10, "0")}`;
}
