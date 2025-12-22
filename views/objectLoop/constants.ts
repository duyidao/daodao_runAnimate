export const ObjectLoopCode = `function hasCircleRef(obj, seen = new Set()) {
  if (!(typeof obj === 'object' && obj !== null)) {
    return false
  }
  
  // 如果当前对象有存储到集合内，说明有循环引用
  if (seen.has(obj)) return true
  seen.add(obj)
  
  // 循环遍历对象的每一个属性
  for (let key in obj) {
    // 如果属性值在集合中能找到，说明有循环引用
    if (hasCircleRef(obj[key], new Set(seen))) {
      return true
    }
  }
  return false
}

// 测试对象
const obj = {
  a: {
    b: 2
  },
  // 这里直接写，显得更直观一点
  c: {
    b: 2
  }
}`;

export type Step = {
  line: number;
  description: string;
  seen: string[];
  activeNode: string | null; // 'root' | 'a' | 'c'
  depth: number;
  isNewScope: boolean;
};

export const ObjectLoopSteps: Step[] = [
  // --- Init ---
  {
    line: 1,
    description: "调用 hasCircleRef(obj)",
    seen: [],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
  {
    line: 2,
    description: "检查类型: obj 是对象",
    seen: [],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
  {
    line: 7,
    description: "seen.has(obj)? 否",
    seen: [],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
  {
    line: 8,
    description: "seen.add(obj)",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },

  // --- Branch A ---
  {
    line: 11,
    description: "循环: key = 'a'",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
  {
    line: 13,
    description: "递归调用 hasCircleRef(obj.a, new Set(seen))",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: true,
  },
  {
    line: 1,
    description: "进入新作用域 (Depth 1)",
    seen: ["root"],
    activeNode: "a",
    depth: 1,
    isNewScope: true,
  },
  {
    line: 7,
    description: "seen.has(obj.a)? 否 (Set 只有 root)",
    seen: ["root"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 8,
    description: "seen.add(obj.a)",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 11,
    description: "循环: key = 'b' (值为 2)",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 13,
    description: "递归调用 hasCircleRef(2, ...)",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: true,
  },
  {
    line: 2,
    description: "检查类型: 2 不是对象，返回 false",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 2,
    isNewScope: false,
  },
  {
    line: 17,
    description: "obj.a 遍历结束，返回 false",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },

  // --- Back to Root ---
  {
    line: 11,
    description: "回到 Root。循环: key = 'c'",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },

  // --- Branch C ---
  {
    line: 13,
    description: "递归调用 hasCircleRef(obj.c, new Set(seen))",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: true,
  },
  {
    line: 1,
    description: "进入新作用域 (Depth 1)",
    seen: ["root"],
    activeNode: "c",
    depth: 1,
    isNewScope: true,
  },
  {
    line: 7,
    description: "seen.has(obj.c)? 否 (Set 只有 root, 无 a)",
    seen: ["root"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 8,
    description: "seen.add(obj.c)",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 11,
    description: "循环: key = 'b' (值为 2)",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    line: 13,
    description: "递归调用 hasCircleRef(2, ...)",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: true,
  },
  {
    line: 2,
    description: "检查类型: 2 不是对象，返回 false",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 2,
    isNewScope: false,
  },
  {
    line: 17,
    description: "obj.c 遍历结束，返回 false",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },

  // --- Finish ---
  {
    line: 17,
    description: "root 遍历结束，返回 false",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
];
