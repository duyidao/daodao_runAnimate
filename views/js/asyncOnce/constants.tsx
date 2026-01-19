import { AnimationStep, SimulationState } from "@/types/asyncOnce";

export const AsyncOnceCode = `async function load() {
  const res = await fetch("https://api.github.com/users/octocat");
  return res.json();
}
function asyncOnce(cb: (...args: any[]) => any) {
  let map: Record<string, {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    isPending: boolean;
  }> = new Map()
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      const key = JSON.stringify(args)
      // 没有就创建一个
      if(!map.has(key)) {
        map.set(key, {
          resolve: [],
          reject: [],
          isPending: false
        })
      }
      const state = map.get(key)
      // 把当前的成功和失败回调保存起来
      state.resolve.push(resolve)
      state.reject.push(reject)
      // 如果已经请求过，则直接返回
      if(state.isPending) return
      // 如果没请求过，则发起请求
      state.isPending = true
      cb(...args)
        .then((res) => {
          state.resolve.forEach((resolve) => resolve(res))
        })
        .catch((err) => {
          state.reject.forEach((reject) => reject(err))
        })
        .finally(() => {
          map.set(key, null)
        })
    })
  }
}
export const loadOnce = asyncOnce(load);`;

const INITIAL_STATE: SimulationState = {
  callers: [
    { id: "User_A", status: "idle" },
    { id: "User_B", status: "idle" },
    { id: "User_C", status: "idle" },
  ],
  map: {},
  apiStatus: "idle",
  highlightedLine: 0,
  description: "准备演示接口请求复用...",
};

export const AsyncOnceSteps: AnimationStep[] = [
  {
    highlightLines: 43,
    description: "1. User_A 发起 loadOnce() 请求。",
    operation: "RUN",
    title: "发起 A 请求",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 43,
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 13,
    description: "2. 计算参数特征 Key，此处无参数，Key 为 '[]'。",
    operation: "EVICT",
    title: "计算 Key",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 13,
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 15,
    description: "3. 检查 Map，发现尚未有该 Key 的请求，进入创建逻辑。",
    operation: "EVICT",
    title: "检查 Map",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 15,
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 16,
    operation: "INIT",
    title: "初始化 Map 节点",
    description:
      "4. 初始化 Map 节点，resolve/reject 为空数组，isPending 为 false。",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 16,
      map: {
        resolveQueue: [],
        isPending: false,
        user: [],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 22,
    description: "5. 从 Map 中获取当前 Key 的状态引用对象 state。",
    operation: "GET",
    title: "获取 Map 节点",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 22,
      map: {
        resolveQueue: [],
        isPending: false,
        user: [],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 24,
    description: "6. 将 User_A 的 resolve 回调存入 resolve 数组。",
    operation: "SET",
    title: "添加 User_A resolve 回调",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 24,
      map: {
        paddngQueue: [],
        isPending: false,
        user: [],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 27,
    description: "7. 判断 isPending，当前为 false，准备发起请求。",
    operation: "RUN",
    title: "判断 isPending",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 27,
      map: {
        paddngQueue: ["User_A"],
        isPending: false,
        user: [],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 29,
    description: "8. 设置 isPending 为 true，锁定后续相同请求。",
    operation: "SET",
    title: "设置 isPending 为 true",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 29,
      map: {
        paddngQueue: ["User_A"],
        isPending: true,
        user: [{ id: "User_A", isPending: true }],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 30,
    description: "9. 真正发起网络请求 (cb(...args))。",
    operation: "RUN",
    title: "发起 A 请求",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 30,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A"],
        isPending: true,
        user: [{ id: "User_A", isPending: true }],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "idle" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 43,
    description: "10. User_B 也需要发起相同的请求。",
    operation: "RUN",
    title: "发起 B 请求",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 43,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A", "User_B"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 24,
    description: "11. User_B 的回调也存入同一个 Map 节点的队列中。",
    operation: "SET",
    title: "添加 User_B resolve 回调",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 24,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A", "User_B"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 27,
    operation: "RUN",
    title: "判断 isPending",
    description:
      "12. User_B 发现 isPending 为 true，直接 return 挂起，不发请求。",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 27,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A", "User_B"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "idle" },
      ],
    },
  },
  {
    highlightLines: 43,
    description: "13. User_C 也发起了 loadOnce()。",
    operation: "RUN",
    title: "发起 C 请求",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 43,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A", "User_B", "User_C"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
          { id: "User_C", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "pending" },
      ],
    },
  },
  {
    highlightLines: 24,
    description: "14. User_C 的回调被推入队列。现在队列中有 3 个等待者。",
    operation: "SET",
    title: "添加 User_C resolve 回调",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 24,
      apiStatus: "fetching",
      map: {
        paddngQueue: ["User_A", "User_B", "User_C"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
          { id: "User_C", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "pending" },
      ],
    },
  },
  {
    highlightLines: 2,
    description: "15. 网络响应成功！获取到 GitHub 数据。",
    operation: "RUN",
    title: "请求成功",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 2,
      apiStatus: "success",
      map: {
        paddngQueue: ["User_A", "User_B", "User_C"],
        isPending: true,
        user: [
          { id: "User_A", isPending: true },
          { id: "User_B", isPending: true },
          { id: "User_C", isPending: true },
        ],
      },
      callers: [
        { id: "User_A", status: "pending" },
        { id: "User_B", status: "pending" },
        { id: "User_C", status: "pending" },
      ],
    },
  },
  {
    highlightLines: 32,
    description: "16. 遍历 resolve 数组，一次性通知所有 User 回调成功。",
    operation: "RUN",
    title: "通知所有 User 回调成功",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 32,
      apiStatus: "success",
      map: {
        paddngQueue: [],
        resolveQueue: ["User_A", "User_B", "User_C"],
        isPending: false,
        user: [
          { id: "User_A", isPending: false, status: true },
          { id: "User_B", isPending: false, status: true },
          { id: "User_C", isPending: false, status: true },
        ],
      },
      callers: [
        { id: "User_A", status: "resolved", result: "{login: 'octocat'}" },
        { id: "User_B", status: "resolved", result: "{login: 'octocat'}" },
        { id: "User_C", status: "resolved", result: "{login: 'octocat'}" },
      ],
    },
  },
  {
    highlightLines: 38,
    description: "17. 请求彻底结束，清理 Map，设为 null，释放内存资源。",
    operation: "FINISH",
    title: "清理 Map",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 38,
      apiStatus: "success",
      map: {
        paddngQueue: [],
        resolveQueue: ["User_A", "User_B", "User_C"],
        isPending: false,
        user: [
          { id: "User_A", isPending: false, status: true },
          { id: "User_B", isPending: false, status: true },
          { id: "User_C", isPending: false, status: true },
        ],
      },
      callers: [
        { id: "User_A", status: "resolved", result: "{login: 'octocat'}" },
        { id: "User_B", status: "resolved", result: "{login: 'octocat'}" },
        { id: "User_C", status: "resolved", result: "{login: 'octocat'}" },
      ],
    },
  },
];
