// packages/core/src/eventBus.ts
type Handler<T> = (payload: T) => void | Promise<void>;

class Recorder {
  private events: Array<{ t: number; topic: string; payload: any }> = [];
  private enabled = false;
  start() { this.enabled = true; this.events = []; }
  stop() { this.enabled = false; }
  clear() { this.events = []; }
  push(topic: string, payload: any) {
    if (!this.enabled) return;
    this.events.push({ t: Date.now(), topic, payload });
  }
  dump() { return this.events.slice(); }
}

export const recorder = new Recorder();

export class EventBus {
  private map = new Map<string, Set<Handler<any>>>();
  on<T>(topic: string, handler: Handler<T>) {
    if (!this.map.has(topic)) this.map.set(topic, new Set());
    this.map.get(topic)!.add(handler as Handler<any>);
  }
  off<T>(topic: string, handler: Handler<T>) {
    this.map.get(topic)?.delete(handler as Handler<any>);
  }
  emit<T>(topic: string, payload: T) {
    recorder.push(topic, payload);
    this.map.get(topic)?.forEach(h => h(payload));
  }
}
export const bus = new EventBus();
