import { create } from "zustand";
type Offer = { id: string; value: string };
type State = { sessionId: string; log: string[]; offers: Offer[]; best?: string };
type Actions = {
  addLog: (s: string) => void;
  addOffer: (o: Offer) => void;
  setBest: (s: string) => void;
  reset: () => void;
};
export const useUCStore = create<State & Actions>((set) => ({
  sessionId: "S-" + Math.random().toString(36).slice(2, 8),
  log: [], offers: [],
  addLog: (s) => set((st) => ({ log: [s, ...st.log] })),
  addOffer: (o) => set((st) => ({ offers: [o, ...st.offers] })),
  setBest: (s) => set({ best: s }),
  reset: () => set({ sessionId: "S-" + Math.random().toString(36).slice(2, 8), log: [], offers: [], best: undefined })
}));
