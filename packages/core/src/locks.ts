// Simple in-memory lock registry keyed by sessionId
const locks = new Set<string>();

export const locksRegistry = {
  isLocked(id: string) {
    return locks.has(id);
  },
  lock(id: string) {
    locks.add(id);
  },
  unlock(id: string) {
    locks.delete(id);
  },
  clear() {
    locks.clear();
  }
};
