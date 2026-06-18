/**
 * Generic localStorage-backed history manager.
 * Stores up to `maxItems` items, newest first.
 */
export function useLocalHistory<T>(storageKey: string, maxItems = 10) {
  function getAll(): T[] {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function add(item: T): T[] {
    const items = getAll();
    items.unshift(item);
    const trimmed = items.slice(0, maxItems);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
    return trimmed;
  }

  function clear(): void {
    localStorage.removeItem(storageKey);
  }

  function remove(predicate: (item: T) => boolean): T[] {
    const items = getAll().filter((item) => !predicate(item));
    localStorage.setItem(storageKey, JSON.stringify(items));
    return items;
  }

  function update(items: T[]): void {
    const trimmed = items.slice(0, maxItems);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  }

  return { getAll, add, clear, remove, update };
}
