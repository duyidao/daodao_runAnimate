import { Step } from "@/types/step";

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

export interface ObjectLoopStep extends Step {
  seen: string[];
  activeNode: string | null; // 'root' | 'a' | 'c'
  depth: number;
  isNewScope: boolean;
}

export const ObjectLoopSteps: ObjectLoopStep[] = [
  {
    highlightLines: 1,
    description: "调用 hasCircleRef(obj)",
    seen: [],
    activeNode: "root",
    depth: 0,
    operation: "RUN",
    title: "调用方法",
    isNewScope: false,
  },
  {
    highlightLines: 2,
    description: "检查类型: obj 是对象",
    seen: [],
    activeNode: "root",
    depth: 0,
    operation: "RUN",
    title: "检查类型",
    isNewScope: false,
  },
  {
    highlightLines: 7,
    description: "seen.has(obj)? 否",
    seen: [],
    activeNode: "root",
    operation: "HAS",
    title: "判断属性",
    depth: 0,
    isNewScope: false,
  },
  {
    highlightLines: 8,
    description: "seen.add(obj)",
    seen: ["root"],
    activeNode: "root",
    operation: "SET",
    title: "添加到 seen",
    depth: 0,
    isNewScope: false,
  },

  // --- Branch A ---
  {
    highlightLines: 11,
    description: "循环: key = 'a'",
    operation: "RUN",
    title: "遍历属性",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
  {
    highlightLines: 13,
    description: "递归调用 hasCircleRef(obj.a, new Set(seen))",
    operation: "RUN",
    title: "调用方法",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: true,
  },
  {
    highlightLines: 1,
    description: "进入新作用域 (Depth 1)",
    operation: "RUN",
    title: "进入新作用域",
    seen: ["root"],
    activeNode: "a",
    depth: 1,
    isNewScope: true,
  },
  {
    highlightLines: 7,
    description: "seen.has(obj.a)? 否 (Set 只有 root)",
    operation: "HAS",
    title: "判断属性",
    seen: ["root"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 8,
    description: "seen.add(obj.a)",
    operation: "SET",
    title: "添加到 seen",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 11,
    description: "循环: key = 'b' (值为 2)",
    operation: "RUN",
    title: "遍历属性",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 13,
    description: "递归调用 hasCircleRef(2, ...)",
    seen: ["root", "a"],
    operation: "RUN",
    title: "调用方法",
    activeNode: "a",
    depth: 1,
    isNewScope: true,
  },
  {
    highlightLines: 2,
    description: "检查类型: 2 不是对象，返回 false",
    operation: "RUN",
    title: "检查类型",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 2,
    isNewScope: false,
  },
  {
    highlightLines: 17,
    description: "obj.a 遍历结束，返回 false",
    operation: "FINISH",
    title: "遍历结束",
    seen: ["root", "a"],
    activeNode: "a",
    depth: 1,
    isNewScope: false,
  },

  // --- Back to Root ---
  {
    highlightLines: 11,
    description: "回到 Root。循环: key = 'c'",
    operation: "RUN",
    title: "遍历属性",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },

  // --- Branch C ---
  {
    highlightLines: 13,
    description: "递归调用 hasCircleRef(obj.c, new Set(seen))",
    operation: "RUN",
    title: "调用方法",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: true,
  },
  {
    highlightLines: 1,
    description: "进入新作用域 (Depth 1)",
    operation: "RUN",
    title: "进入新作用域",
    seen: ["root"],
    activeNode: "c",
    depth: 1,
    isNewScope: true,
  },
  {
    highlightLines: 7,
    description: "seen.has(obj.c)? 否 (Set 只有 root, 无 a)",
    operation: "HAS",
    title: "判断属性",
    seen: ["root"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 8,
    description: "seen.add(obj.c)",
    operation: "SET",
    title: "添加到 seen",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 11,
    description: "循环: key = 'b' (值为 2)",
    operation: "RUN",
    title: "遍历属性",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },
  {
    highlightLines: 13,
    description: "递归调用 hasCircleRef(2, ...)",
    operation: "RUN",
    title: "调用方法",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: true,
  },
  {
    highlightLines: 2,
    description: "检查类型: 2 不是对象，返回 false",
    operation: "RUN",
    title: "检查类型",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 2,
    isNewScope: false,
  },
  {
    highlightLines: 17,
    description: "obj.c 遍历结束，返回 false",
    operation: "FINISH",
    title: "遍历结束",
    seen: ["root", "c"],
    activeNode: "c",
    depth: 1,
    isNewScope: false,
  },

  // --- Finish ---
  {
    highlightLines: 17,
    description: "root 遍历结束，返回 false",
    operation: "FINISH",
    title: "遍历结束",
    seen: ["root"],
    activeNode: "root",
    depth: 0,
    isNewScope: false,
  },
];
