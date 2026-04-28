import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Node 25 ships a native (non-functional without --localstorage-file) localStorage
// that shadows jsdom's. Replace it with an in-memory polyfill so tests can use it.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear(): void { this.store.clear(); }
  getItem(key: string): string | null { return this.store.has(key) ? this.store.get(key)! : null; }
  key(index: number): string | null { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string): void { this.store.delete(key); }
  setItem(key: string, value: string): void { this.store.set(key, String(value)); }
}

const memLocal = new MemoryStorage();
const memSession = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { value: memLocal, configurable: true, writable: true });
Object.defineProperty(globalThis, "sessionStorage", { value: memSession, configurable: true, writable: true });
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", { value: memLocal, configurable: true, writable: true });
  Object.defineProperty(window, "sessionStorage", { value: memSession, configurable: true, writable: true });
}

afterEach(() => cleanup());
