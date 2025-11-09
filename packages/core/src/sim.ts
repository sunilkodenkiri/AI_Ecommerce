// packages/core/src/sim.ts
export type SimSpeed = 'slow' | 'normal' | 'fast';
export type SimSettings = {
  speed: SimSpeed;
  seed: number;
  chaos: { vendorDefault: boolean };
  latencyBase: number;
  latencyJitter: number;
};

// Mulberry32 seedable RNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _settings: SimSettings = {
  speed: 'normal',
  seed: 42,
  chaos: { vendorDefault: false },
  latencyBase: 350,
  latencyJitter: 350
};
let rand = mulberry32(_settings.seed);

export const sim = {
  get settings() { return _settings; },
  setSettings(patch: Partial<SimSettings>) {
    _settings = { ..._settings, ...patch, chaos: { ..._settings.chaos, ...(patch.chaos || {}) } };
    if (typeof patch.seed === 'number') rand = mulberry32(_settings.seed);
  },
  rng() { return rand(); },
  latencyMs() {
    const { speed, latencyBase, latencyJitter } = _settings;
    const mult = speed === 'fast' ? 0.5 : speed === 'slow' ? 1.8 : 1.0;
    const base = latencyBase * mult;
    const jitter = latencyJitter * mult;
    const r = this.rng();
    return Math.floor(base + r * jitter);
  },
  reset(seed?: number) {
    if (typeof seed === 'number') _settings.seed = seed;
    rand = mulberry32(_settings.seed);
  }
};

// ✅ add default export to be safe with various bundlers
export default sim;
