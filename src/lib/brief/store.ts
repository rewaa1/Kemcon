import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  emptyContact,
  emptyProject,
  type BriefContact,
  type BriefLineItem,
  type BriefProject,
  type BriefType,
} from "./types";

/**
 * The brief store — the one piece of state that outlives a route.
 *
 * Why an external store rather than route-level state: this project does not
 * enable `cacheComponents`, so Next.js does not preserve page state across
 * navigations via `<Activity>`. The Next.js docs are explicit that without
 * Cache Components, hoisting to a shared layout or using an external store is
 * the way to keep state across navigations. The brief has to survive
 * catalog → configurator → catalog → brief, so it lives here.
 *
 * Persistence notes — both of these are correctness requirements, not polish:
 *
 * 1. `photos` holds `File` objects, which do not survive `JSON.stringify`.
 *    They are excluded from `partialize`. They still survive client-side
 *    navigation (the store module stays alive); only a hard reload drops
 *    them, which is acceptable for a picker the visitor just used.
 *
 * 2. `hydrated` gates any UI that renders persisted values. The site is
 *    server-rendered, so a component that renders `items.length` on the first
 *    client pass would mismatch the server's HTML. Components must render the
 *    empty state until `hydrated` is true.
 */

const STORAGE_KEY = "kemcon_brief_v1";

/** Increment whenever the persisted brief shape changes. */
const BRIEF_SCHEMA_VERSION = 1;

interface BriefState {
  type: BriefType;
  items: BriefLineItem[];
  project: BriefProject;
  notes: string;
  inspirationImages: string[];
  /** Not persisted — see note 2 above. */
  photos: File[];
  contact: BriefContact;
  /** False until the persisted state has been read back. */
  hydrated: boolean;
  /** Transient UI state — deliberately outside `partialize`. */
  drawerOpen: boolean;

  openDrawer: () => void;
  closeDrawer: () => void;
  setType: (type: BriefType) => void;
  addItem: (item: BriefLineItem) => void;
  updateItem: (id: string, updates: Partial<BriefLineItem>) => void;
  replaceItem: (item: BriefLineItem) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  setProject: (updates: Partial<BriefProject>) => void;
  setNotes: (notes: string) => void;
  toggleInspiration: (src: string, maxSelect?: number) => void;
  setPhotos: (photos: File[]) => void;
  setContact: (updates: Partial<BriefContact>) => void;
  clear: () => void;
  setHydrated: () => void;
}

const initialState = {
  type: "standard" as BriefType,
  items: [] as BriefLineItem[],
  project: emptyProject,
  notes: "",
  inspirationImages: [] as string[],
  photos: [] as File[],
  contact: emptyContact,
};

/** Never let a missing or malformed quantity produce NaN in a total. */
export function safeQuantity(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export const useBriefStore = create<BriefState>()(
  persist(
    (set) => ({
      ...initialState,
      hydrated: false,
      drawerOpen: false,

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      setType: (type) => set({ type }),

      addItem: (item) => set((s) => ({ items: [...s.items, item] })),

      updateItem: (id, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),

      replaceItem: (item) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === item.id ? item : i)),
        })),

      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: safeQuantity(quantity) } : i
          ),
        })),

      setProject: (updates) => set((s) => ({ project: { ...s.project, ...updates } })),

      setNotes: (notes) => set({ notes }),

      toggleInspiration: (src, maxSelect = 5) =>
        set((s) => {
          if (s.inspirationImages.includes(src)) {
            return { inspirationImages: s.inspirationImages.filter((x) => x !== src) };
          }
          if (s.inspirationImages.length >= maxSelect) return s;
          return { inspirationImages: [...s.inspirationImages, src] };
        }),

      setPhotos: (photos) => set({ photos }),

      setContact: (updates) => set((s) => ({ contact: { ...s.contact, ...updates } })),

      clear: () => set({ ...initialState }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Bump when the persisted shape changes. Without this, a brief saved by
      // an older build hydrates into newer code and can carry missing fields
      // (a missing `quantity` becomes NaN and poisons every total).
      version: BRIEF_SCHEMA_VERSION,
      migrate: (persisted, version) => {
        // No forward migration is worth guessing at: a brief is short-lived
        // working state, so an older one is discarded rather than half-read.
        if (version !== BRIEF_SCHEMA_VERSION) return { ...initialState };
        return persisted as Partial<BriefState>;
      },
      // `photos` holds File objects and `hydrated` is runtime-only.
      partialize: (s) => ({
        type: s.type,
        items: s.items,
        project: s.project,
        notes: s.notes,
        inspirationImages: s.inspirationImages,
        contact: s.contact,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

/**
 * Total number of pieces across the brief, which is what the count badge
 * should show — a bulk brief of "200 bed sheet sets" reads better as 200 than
 * as 1. Returns 0 until hydrated so server and first client render agree.
 */
export function useBriefCount(): number {
  return useBriefStore((s) =>
    s.hydrated
      ? s.items.reduce((total, item) => total + safeQuantity(item.quantity), 0)
      : 0
  );
}

/** Number of distinct configured products. */
export function useBriefItemCount(): number {
  return useBriefStore((s) => (s.hydrated ? s.items.length : 0));
}

/**
 * Note for future selectors: Zustand v5 compares selector output with
 * `Object.is`. A selector that builds a new array or object every call will
 * re-render forever. Return primitives, or wrap the selector in `useShallow`
 * from `zustand/shallow`.
 */
