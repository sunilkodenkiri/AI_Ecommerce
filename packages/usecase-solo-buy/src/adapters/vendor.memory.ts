type Memory = {
  undercutBias: number; // negative => more aggressive
  wins: number;
  losses: number;
};
const mem: Record<string, Memory> = {};

export function getMem(vendorId: string): Memory {
  return (mem[vendorId] ??= { undercutBias: 0, wins: 0, losses: 0 });
}

export function recordWin(vendorId: string) {
  const m = getMem(vendorId);
  m.wins++;
  // winning often -> become slightly less aggressive
  m.undercutBias = Math.min(m.undercutBias + 0.5, 6);
}

export function recordLoss(vendorId: string) {
  const m = getMem(vendorId);
  m.losses++;
  // losing -> become more aggressive
  m.undercutBias = Math.max(m.undercutBias - 1, -12);
}
