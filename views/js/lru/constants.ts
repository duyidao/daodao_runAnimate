import { Step } from "@/types/step";

export interface ExecutionStep extends Step {
  id: number;
  cache: string[]; // Order of keys in the Map
  cacheValues: Record<string, any>;
  targetKey?: string;
  evictedKey?: string;
  result?: any;
}

export const LruCode = `class LRUCache {
  #cache;
  max;
  constructor(max = 4) {
    this.max = max;
    this.#cache = new Map();
  }

  has(key) {
    return this.#cache.has(key);
  }

  get(key) {
    if (this.#cache.has(key)) {
      const value = this.#cache.get(key);
      this.#cache.delete(key); // 删除原来的数据
      this.#cache.set(key, value); // 重新插入数据
      return value;
    }
    return undefined;
  }

  set(key, value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    } else if (this.#cache.size >= this.max) {
      // 删除最久未使用的属性
      this.#cache.delete(this.#cache.keys().next().value)
    }
    this.#cache.set(key, value); // 插入新的数据
  }
}

// --- 使用示例 (Driver Code) ---
const lru = new LRUCache(4);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
lru.set('d', 4);
lru.set('e', 5); // 触发淘汰 'a'
lru.get('b');    // 移动 'b' 到最新
lru.has('c');
lru.set('f', 6); // 触发淘汰 'c'
lru.get('g');`;

export const LruCodeSteps: ExecutionStep[] = [
  {
    id: 1,
    title: "初始化缓存",
    operation: "INIT",
    description: "创建一个最大容量为 4 的 LRU 缓存实例。",
    highlightLines: [4, 5, 6, 7, 35],
    cache: [],
    cacheValues: {},
  },
  {
    id: 2,
    title: "设置 'a'",
    operation: "SET",
    description: "第一次访问 'a'，将其插入缓存。",
    highlightLines: [24, 30, 36],
    cache: ["a"],
    cacheValues: { a: 1 },
    targetKey: "a",
  },
  {
    id: 3,
    title: "设置 'b'",
    operation: "SET",
    description: "第二次访问 'b'，将其插入缓存。",
    highlightLines: [24, 30, 37],
    cache: ["a", "b"],
    cacheValues: { a: 1, b: 2 },
    targetKey: "b",
  },
  {
    id: 4,
    title: "设置 'c'",
    operation: "SET",
    description: "第三次访问 'c'，将其插入缓存。",
    highlightLines: [24, 30, 38],
    cache: ["a", "b", "c"],
    cacheValues: { a: 1, b: 2, c: 3 },
    targetKey: "c",
  },
  {
    id: 5,
    title: "设置 'd'",
    operation: "SET",
    description: "第四次访问 'd'，将其插入缓存。此时缓存已满。",
    highlightLines: [24, 30, 39],
    cache: ["a", "b", "c", "d"],
    cacheValues: { a: 1, b: 2, c: 3, d: 4 },
    targetKey: "d",
  },
  {
    id: 6,
    title: "设置 'e' (触发淘汰)",
    operation: "EVICT",
    description: "第五次访问 'e'。缓存已满，需要淘汰最久未使用的 'a'。",
    highlightLines: [26, 27, 28, 29, 30, 40],
    cache: ["b", "c", "d", "e"],
    cacheValues: { b: 2, c: 3, d: 4, e: 5 },
    targetKey: "e",
    evictedKey: "a",
  },
  {
    id: 7,
    title: "访问 'b' (触发移动)",
    operation: "MOVE",
    description: "获取 'b'。'b' 已在缓存中，将其移动到末尾（最新使用）。",
    highlightLines: [14, 15, 16, 17, 18, 19, 41],
    cache: ["c", "d", "e", "b"],
    cacheValues: { b: 2, c: 3, d: 4, e: 5 },
    targetKey: "b",
    result: 2,
  },
  {
    id: 8,
    title: "判断 'c' 是否存在",
    operation: "HAS",
    description: "调用 has('c') 检查缓存中是否有 'c'。此操作不改变顺序。",
    highlightLines: [9, 10, 11, 42],
    cache: ["c", "d", "e", "b"],
    cacheValues: { b: 2, c: 3, d: 4, e: 5 },
    targetKey: "c",
    result: true,
  },
  {
    id: 9,
    title: "设置 'f' (再次淘汰)",
    operation: "EVICT",
    description: "设置 'f'。此时 'c' 是最久未使用的，将其淘汰。",
    highlightLines: [26, 27, 28, 29, 30, 43],
    cache: ["d", "e", "b", "f"],
    cacheValues: { d: 4, e: 5, b: 2, f: 6 },
    targetKey: "f",
    evictedKey: "c",
  },
  {
    id: 10,
    title: "获取 'g' (不存在)",
    operation: "GET",
    description: "尝试获取 'g'，但缓存中不存在。返回 undefined。",
    highlightLines: [14, 19, 20, 44],
    cache: ["d", "e", "b", "f"],
    cacheValues: { d: 4, e: 5, b: 2, f: 6 },
    targetKey: "g",
    result: undefined,
  },
];
