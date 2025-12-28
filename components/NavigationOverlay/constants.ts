import { Category, PromiseStatus } from "../../types/navigationOverlay";

export const CATEGORIES: Category[] = [
  {
    id: "js",
    name: "JS 异步与进阶",
    scenarios: [
      {
        id: "promise-cancel",
        name: "Promise 任务取消",
        code: `function createCancelTask(task) {
  let cancel = () => {};
  return (...args) => {
    return new Promise((resolve, reject) => {
      cancel();
      cancel = () => {
        resolve = reject = () => {};
      };
      task(...args)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  };
}

const init = createCancelTask(async (id) => {
  const res = await fetch(\`https://api.xxx.com/order/\${id}\`);
  return res.json();
});

init(1);
init(2);`,
        steps: [
          {
            id: 0,
            highlightLines: [],
            description: "初始状态。全局执行上下文已建立，等待代码执行。",
            actionTitle: "程序就绪",
            cancelVariableStatus: "initial",
            tasks: [],
            terminalOutput: ["系统已准备就绪..."],
          },
          {
            id: 1,
            highlightLines: [1, 14],
            description:
              "定义高阶函数 createCancelTask。它利用闭包来维护一个取消逻辑的引用。",
            actionTitle: "定义工厂函数",
            cancelVariableStatus: "initial",
            tasks: [],
            terminalOutput: ["> 定义 createCancelTask"],
          },
          {
            id: 2,
            highlightLines: [16, 17, 18, 19],
            description:
              "执行 createCancelTask。返回一个新的匿名函数，并将其赋值给 init。此时闭包内的 cancel 变量被初始化为一个空函数。",
            actionTitle: "初始化 init 实例",
            cancelVariableStatus: "initial",
            tasks: [],
            terminalOutput: [
              "> init 函数已通过闭包创建",
              "> 内部 cancel 初始值为: () => {}",
            ],
          },
          {
            id: 3,
            highlightLines: [21],
            description:
              "调用 init(1)。程序进入 init 函数体。这是第一个异步任务的起点。",
            actionTitle: "调用 init(1)",
            cancelVariableStatus: "initial",
            tasks: [],
            terminalOutput: ["> 开始执行 init(1)"],
          },
          {
            id: 4,
            highlightLines: [4],
            description:
              "进入 new Promise。JavaScript 引擎立即执行构造函数内的 Executor 函数。此时 resolve1 和 reject1 被注入。",
            actionTitle: "创建 Promise #1",
            cancelVariableStatus: "initial",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> Promise #1 已进入 Pending 状态"],
          },
          {
            id: 5,
            highlightLines: [5],
            description:
              "执行 cancel()。此时闭包中的 cancel 还是初始的空函数，因此不会发生任何操作。",
            actionTitle: "执行 cancel (空操作)",
            cancelVariableStatus: "initial",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> 执行当前 cancel()...", "> 无任务需取消"],
          },
          {
            id: 6,
            highlightLines: [6, 7, 8],
            description:
              "重写闭包变量 cancel。现在的 cancel 持有了对 resolve1 和 reject1 的引用。如果它再次被执行，任务 #1 将会失效。",
            actionTitle: "更新取消处理器",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: [
              "> 闭包变量 cancel 已更新",
              "> 它现在指向任务 #1 的'失效化'函数",
            ],
          },
          {
            id: 7,
            highlightLines: [9, 10],
            description:
              "开始执行真正的异步任务 task(1)。网络请求 fetch(/order/1) 发出，Promise 等待 resolve1 的调用。",
            actionTitle: "发起网络请求 #1",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> 正在请求订单 1 数据...", "> 监听响应中..."],
          },
          {
            id: 8,
            highlightLines: [22],
            description:
              "在任务 #1 还在 Pending 时，代码执行到了 init(2)。开始第二个任务周期。",
            actionTitle: "并发调用 init(2)",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> 开始执行 init(2)"],
          },
          {
            id: 9,
            highlightLines: [4],
            description:
              "init(2) 创建了 Promise #2。现在内存中有两个并行的 Promise 任务。",
            actionTitle: "创建 Promise #2",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> Promise #2 已进入 Pending 状态"],
          },
          {
            id: 10,
            highlightLines: [5],
            description:
              "关键时刻：init(2) 执行了 cancel()。由于闭包共享，它调用的是我们在第 6 步中设置的函数！",
            actionTitle: "触发任务 #1 取消",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: [
              "> 执行当前 cancel()...",
              "> 发现该函数持有任务 #1 的引用！",
            ],
          },
          {
            id: 11,
            highlightLines: [7],
            description:
              "在 cancel() 内部，任务 #1 的 resolve1 和 reject1 被重新赋值为空函数。任务 #1 逻辑上已被'丢弃'。",
            actionTitle: "重置任务 #1 指针",
            cancelVariableStatus: "set-for-1",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: [
              "> resolve1 = () => {}",
              "> 任务 #1 已标记为失效 (Stale)",
            ],
          },
          {
            id: 12,
            highlightLines: [6, 7, 8],
            description:
              "init(2) 继续执行，将闭包变量 cancel 更新为指向它自己的 resolve2 和 reject2。",
            actionTitle: "更新取消处理器",
            cancelVariableStatus: "set-for-2",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: [
              "> 闭包变量 cancel 已更新",
              "> 它现在指向任务 #2 的'失效化'函数",
            ],
          },
          {
            id: 13,
            highlightLines: [9, 10],
            description:
              "发起网络请求 #2。现在两个请求都在后台运行，但只有任务 #2 能最终触发 UI 更新。",
            actionTitle: "发起网络请求 #2",
            cancelVariableStatus: "set-for-2",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> 正在请求订单 2 数据...", "> 监听响应中..."],
          },
          {
            id: 14,
            highlightLines: [10],
            description:
              "任务 #1 请求先返回。触发了它的 .then()，并尝试调用 resolve1(res)。",
            actionTitle: "响应 #1 返回",
            cancelVariableStatus: "set-for-2",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.PENDING,
                result: "{订单1数据}",
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: ["> 响应 #1 已到达", "> 尝试执行 resolve1..."],
          },
          {
            id: 15,
            highlightLines: [10],
            description:
              "由于 resolve1 已被置空（空函数），执行 resolve1(res) 不会触发 Promise #1 的状态变更。它永远保持 Pending。",
            actionTitle: "忽略响应 #1",
            cancelVariableStatus: "set-for-2",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.CANCELLED,
                result: "{订单1数据}",
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.PENDING,
                result: null,
                isStale: false,
              },
            ],
            terminalOutput: [
              "> resolve1 是空操作，结果被丢弃",
              "> 任务 #1 成功被'拦截'",
            ],
          },
          {
            id: 16,
            highlightLines: [10],
            description:
              "任务 #2 请求随后返回。调用 resolve2(res)。由于它没被后续任务重置，resolve2 是原始有效的函数。",
            actionTitle: "响应 #2 返回",
            cancelVariableStatus: "set-for-2",
            tasks: [
              {
                id: 1,
                status: PromiseStatus.CANCELLED,
                result: "{订单1数据}",
                isStale: true,
              },
              {
                id: 2,
                status: PromiseStatus.RESOLVED,
                result: "{订单2数据}",
                isStale: false,
              },
            ],
            terminalOutput: [
              "> 响应 #2 已到达",
              "> 成功执行有效 resolve2！",
              "> 最终页面渲染：订单 2 数据",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "vue",
    name: "Vue 响应式原理",
    scenarios: [
      {
        id: "vue-ref-effect",
        name: "Ref 与 Effect 追踪",
        code: `const flag = ref(true);
const count = ref(0);

effect(() => {
  flag.value;
  console.log("run", count.value);
});

flag.value = !flag.value;
count.value++;`,
        steps: [
          {
            id: 0,
            highlightLines: [1, 2],
            description:
              "创建两个响应式引用 flag 和 count。Vue 会在内部为它们维护依赖列表 (Dep)。",
            actionTitle: "响应式初始化",
            tasks: [],
            terminalOutput: ["> ref flag created", "> ref count created"],
          },
          {
            id: 1,
            highlightLines: [4, 5, 6, 7],
            description:
              "执行 effect。首先执行传入的函数，访问 flag.value 触发 track（依赖收集）。",
            actionTitle: "依赖收集开始",
            tasks: [],
            terminalOutput: ["> effect 开始执行", "> 访问 flag.value..."],
          },
          {
            id: 2,
            highlightLines: [5],
            description:
              "flag 将当前的 ReactiveEffect 添加到它的 Dep 集合中。这意味着当 flag 变化时，effect 会重新运行。",
            actionTitle: "完成依赖绑定",
            tasks: [],
            terminalOutput: ["> flag 收集了当前 effect 作为依赖"],
          },
          {
            id: 3,
            highlightLines: [9],
            description: "修改 flag.value。这会触发 trigger（派发更新）。",
            actionTitle: "派发更新",
            tasks: [],
            terminalOutput: ["> flag 发生变化", "> 触发关联的 effect 重新执行"],
          },
          {
            id: 4,
            highlightLines: [4, 5, 6, 7],
            description:
              "Effect 重新执行。整个链路完全复用，零内存分配，性能最优。",
            actionTitle: "Re-run 结束",
            tasks: [],
            terminalOutput: ["> effect 重新运行完成", "> 输出: run 0"],
          },
        ],
      },
    ],
  },
];
