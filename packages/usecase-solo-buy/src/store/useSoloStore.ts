import { create } from "zustand";
import { locksRegistry } from "@ac/core";

export type Offer = {
  vendorId: string;
  price: number;
  etaHours: number;
  deliveryFee?: number;
  slaTier?: "STANDARD" | "EXPRESS" | "PRIORITY";
  reliability?: number;
};

export type VendorMode = "AUTO" | "HYBRID" | "MANUAL" | "HUMAN";

export type VendorState = {
  mode: VendorMode;
  latest?: Offer;
};

export type Session = {
  sessionId: string;
  productId: string;
  qty: number;
  buyerPrice: number;
  offers: Offer[];
  best?: Offer;
  status: "idle" | "negotiating" | "locked" | "rejected";
  escrowLocked: boolean;
  acceptedOffer?: Offer;
  vendorPool: string[];
  vendorStates: Record<string, VendorState>;
};

type State = {
  sessions: Record<string, Session>;
  activeSessionId: string;
  _initialized: boolean;
};

type Actions = {
  initialize: (count?: number, firstOverrides?: Partial<Session>) => void;
  createBuyer: (overrides?: Partial<Session>) => string;
  removeBuyer: (sessionId: string) => void;
  setActive: (sessionId: string) => void;

  setBuyerPrice: (sessionId: string, p: number) => void;
  addOffer: (sessionId: string, o: Offer) => void;
  setBest: (sessionId: string, o: Offer) => void;
  setStatus: (sessionId: string, s: Session["status"]) => void;
  lockEscrow: (sessionId: string, o: Offer) => void;
  clearOffers: (sessionId: string) => void;
  resetSession: (sessionId: string) => void;

  setVendorMode: (sessionId: string, vendorId: string, mode: VendorMode) => void;
};

function defaultVendorStates(ids: string[]): Record<string, VendorState> {
  const states: Record<string, VendorState> = {};
  ids.forEach(id => { states[id] = { mode: id === "V-AUTO" ? "AUTO" : id === "V-HYBRID" ? "HYBRID" : "MANUAL" }; });
  return states;
}

function newSession(overrides?: Partial<Session>): Session {
  const vendorPool = overrides?.vendorPool ?? ["V-AUTO", "V-HYBRID", "V-MANUAL"];
  return {
    sessionId: "S-" + Math.random().toString(36).slice(2, 8),
    productId: overrides?.productId ?? "P-ARECA-M",
    qty: overrides?.qty ?? 1,
    buyerPrice: overrides?.buyerPrice ?? 550,
    offers: [],
    status: "idle",
    escrowLocked: false,
    vendorPool,
    vendorStates: defaultVendorStates(vendorPool),
    ...overrides
  };
}

export const useSoloStore = create<State & Actions>((set, get) => ({
  sessions: {},
  activeSessionId: "",
  _initialized: false,

  initialize: (count = 2, firstOverrides?: Partial<Session>) => {
    const st = get();
    if (st._initialized) return;
    const created: Record<string, Session> = {};
    let firstId = "";
    for (let i = 0; i < count; i++) {
      const s = newSession(i === 0 ? firstOverrides : undefined);
      created[s.sessionId] = s;
      if (!firstId) firstId = s.sessionId;
    }
    set({ sessions: created, activeSessionId: firstId, _initialized: true });
  },

  createBuyer: (overrides?: Partial<Session>) => {
    const s = newSession(overrides);
    set((st) => ({ sessions: { ...st.sessions, [s.sessionId]: s } }));
    return s.sessionId;
  },

  removeBuyer: (sessionId) =>
    set((st) => {
      const { [sessionId]: _, ...rest } = st.sessions;
      let nextActive = st.activeSessionId;
      if (sessionId === st.activeSessionId) {
        const ids = Object.keys(rest);
        nextActive = ids[0] || "";
      }
      locksRegistry.unlock(sessionId);
      return { sessions: rest, activeSessionId: nextActive };
    }),

  setActive: (sessionId) => set({ activeSessionId: sessionId }),

  setBuyerPrice: (sessionId, p) =>
    set((st) => ({
      sessions: { ...st.sessions, [sessionId]: { ...st.sessions[sessionId], buyerPrice: p } }
    })),

  addOffer: (sessionId, o) =>
    set((st) => {
      const ses = st.sessions[sessionId];
      if (!ses) return st;
      const vs = { ...ses.vendorStates };
      vs[o.vendorId] = { ...(vs[o.vendorId] ?? { mode: "AUTO" }), latest: o };
      return {
        sessions: {
          ...st.sessions,
          [sessionId]: { ...ses, offers: [...ses.offers, o], vendorStates: vs }
        }
      };
    }),

  setBest: (sessionId, o) =>
    set((st) => ({ sessions: { ...st.sessions, [sessionId]: { ...st.sessions[sessionId], best: o } } })),

  setStatus: (sessionId, status) =>
    set((st) => ({ sessions: { ...st.sessions, [sessionId]: { ...st.sessions[sessionId], status } } })),

  lockEscrow: (sessionId, o) =>
    set((st) => {
      locksRegistry.lock(sessionId);
      const ses = st.sessions[sessionId];
      return {
        sessions: {
          ...st.sessions,
          [sessionId]: { ...ses, escrowLocked: true, acceptedOffer: o, status: "locked" }
        }
      };
    }),

  clearOffers: (sessionId) =>
    set((st) => ({
      sessions: { ...st.sessions, [sessionId]: { ...st.sessions[sessionId], offers: [], best: undefined } }
    })),

  resetSession: (sessionId) =>
    set((st) => {
      locksRegistry.unlock(sessionId);
      const prev = st.sessions[sessionId];
      const fresh = newSession({ productId: prev.productId, qty: prev.qty, vendorPool: prev.vendorPool });
      return { sessions: { ...st.sessions, [sessionId]: { ...fresh, sessionId } } };
    }),

  setVendorMode: (sessionId, vendorId, mode) =>
    set((st) => {
      const ses = st.sessions[sessionId];
      const vs = { ...ses.vendorStates, [vendorId]: { ...(ses.vendorStates[vendorId] ?? {}), mode } };
      return { sessions: { ...st.sessions, [sessionId]: { ...ses, vendorStates: vs } } };
    })
}));
