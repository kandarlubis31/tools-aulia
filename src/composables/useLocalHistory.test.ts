import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalHistory } from './useLocalHistory';

interface TestItem {
  id: number;
  name: string;
}

describe('useLocalHistory', () => {
  const KEY = '__test_history__';
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
    });
  });

  describe('getAll', () => {
    it('should return empty array when nothing stored', () => {
      const history = useLocalHistory<TestItem>(KEY);
      expect(history.getAll()).toEqual([]);
    });

    it('should return stored items', () => {
      const items: TestItem[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      localStorage.setItem(KEY, JSON.stringify(items));

      const history = useLocalHistory<TestItem>(KEY);
      expect(history.getAll()).toEqual(items);
    });

    it('should return empty array when JSON is malformed', () => {
      localStorage.setItem(KEY, '{broken json');

      const history = useLocalHistory<TestItem>(KEY);
      expect(history.getAll()).toEqual([]);
    });
  });

  describe('add', () => {
    it('should add item at the beginning (newest first)', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'A' });
      history.add({ id: 2, name: 'B' });

      const result = history.getAll();
      expect(result).toEqual([
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ]);
    });

    it('should trim to maxItems (default 10)', () => {
      const history = useLocalHistory<TestItem>(KEY, 3);
      history.add({ id: 1, name: 'A' });
      history.add({ id: 2, name: 'B' });
      history.add({ id: 3, name: 'C' });
      history.add({ id: 4, name: 'D' });

      const result = history.getAll();
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 4, name: 'D' });
      expect(result[2]).toEqual({ id: 2, name: 'B' });
    });

    it('should save to localStorage', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'Test' });

      const raw = localStorage.getItem(KEY);
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed).toEqual([{ id: 1, name: 'Test' }]);
    });
  });

  describe('clear', () => {
    it('should remove all items', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'A' });
      history.clear();

      expect(history.getAll()).toEqual([]);
      expect(localStorage.getItem(KEY)).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove items matching predicate', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'A' });
      history.add({ id: 2, name: 'B' });
      history.add({ id: 3, name: 'A' });

      history.remove((item) => item.name === 'A');

      const result = history.getAll();
      expect(result).toEqual([{ id: 2, name: 'B' }]);
    });

    it('should not change storage when no items match', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'A' });

      history.remove((item) => item.name === 'Z');

      expect(history.getAll()).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should replace all items', () => {
      const history = useLocalHistory<TestItem>(KEY);
      history.add({ id: 1, name: 'A' });

      history.update([{ id: 2, name: 'B' }, { id: 3, name: 'C' }]);

      const result = history.getAll();
      expect(result).toEqual([{ id: 2, name: 'B' }, { id: 3, name: 'C' }]);
    });

    it('should trim items beyond maxItems', () => {
      const history = useLocalHistory<TestItem>(KEY, 2);
      history.update([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
      ]);

      expect(history.getAll()).toHaveLength(2);
    });
  });

  describe('custom maxItems', () => {
    it('should respect custom maxItems', () => {
      const history = useLocalHistory<TestItem>(KEY, 5);
      for (let i = 0; i < 10; i++) {
        history.add({ id: i, name: `Item ${i}` });
      }

      expect(history.getAll()).toHaveLength(5);
    });
  });
});
