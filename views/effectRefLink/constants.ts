import { SimulationState, AnimationStep } from "../../types/types";

export const EffectRefLinkCode = `const flag = ref(true);
const count = ref(0);

effect(() => {
  flag.value;
  console.count("run", count.value, flag.value);
});

btn.addEventListener("click", () => {
  flag.value = !flag.value;
  count.value++;
});`;

const INITIAL_STATE: SimulationState = {
  refs: {},
  effects: {},
  links: {},
  activeSubId: undefined,
  highlightedLine: 0,
  description: "初始化脚本...",
  operationType: "SYSTEM",
};

export const EffectRefLinkSteps: AnimationStep[] = [
  {
    line: 1,
    description: "执行 ref(true): 创建 flag 响应式变量",
    operationType: "REF_INIT",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 1,
      refs: { ref_flag: { id: "ref_flag", name: "flag", value: true } },
    },
  },
  {
    line: 2,
    description: "执行 ref(0): 创建 count 响应式变量",
    operationType: "REF_INIT",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 2,
      refs: {
        ref_flag: { id: "ref_flag", name: "flag", value: true },
        ref_count: { id: "ref_count", name: "count", value: 0 },
      },
    },
  },
  {
    line: 4,
    description: "创建 ReactiveEffect 对象，准备执行副作用函数",
    operationType: "EFFECT_INIT",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 4,
      refs: {
        ref_flag: { id: "ref_flag", name: "flag", value: true },
        ref_count: { id: "ref_count", name: "count", value: 0 },
      },
      effects: { eff_1: { id: "eff_1", name: "effect" } },
    },
  },
  {
    line: 4,
    description:
      "Effect.run(): 进入副作用作用域。关键动作: this.depsTail = undefined",
    operationType: "EFFECT_RUN",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 4,
      activeSubId: "eff_1",
      refs: {
        ref_flag: { id: "ref_flag", name: "flag", value: true },
        ref_count: { id: "ref_count", name: "count", value: 0 },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsTailId: "undefined",
        },
      },
    },
  },
  {
    line: 5,
    description: "访问 flag.value: 触发 track(flag)。创建并链接 link1",
    operationType: "LINK_CREATE",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 5,
      activeSubId: "eff_1",
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: true,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: { id: "ref_count", name: "count", value: 0 },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsHeadId: "link1",
          depsTailId: "link1",
        },
      },
      links: { link1: { id: "link1", depId: "ref_flag", subId: "eff_1" } },
    },
  },
  {
    line: 6,
    description:
      "访问 count.value: 触发 track(count)。创建 link2 并建立链表关系",
    operationType: "LINK_CREATE",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 6,
      activeSubId: "eff_1",
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: true,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsHeadId: "link1",
          depsTailId: "link2",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 7,
    description:
      "Run 结束。节点已正确连接在 Effect 的 deps 链和 Ref 的 subs 链上",
    operationType: "FINISH",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 7,
      activeSubId: undefined,
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: true,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          depsHeadId: "link1",
          depsTailId: "link2",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 11,
    description: "用户操作: flag 变更。Effect 被标记为 dirty，准备 Re-run",
    operationType: "TRIGGER",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 11,
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: false,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          depsHeadId: "link1",
          depsTailId: "link2",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 4,
    description: "Re-run 开始。再次重置: depsTail = undefined",
    operationType: "EFFECT_RUN",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 4,
      activeSubId: "eff_1",
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: false,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsHeadId: "link1",
          depsTailId: "undefined",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 5,
    description:
      "再次 track(flag): 发现 link1 的 dep 已匹配。复用 link1，设置 depsTail = link1",
    operationType: "REUSED",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 5,
      activeSubId: "eff_1",
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: false,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsHeadId: "link1",
          depsTailId: "link1",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 6,
    description:
      "再次 track(count): 发现下一个节点 link2 的 dep 匹配。复用 link2，设置 depsTail = link2",
    operationType: "REUSED",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 6,
      activeSubId: "eff_1",
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: false,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          active: true,
          depsHeadId: "link1",
          depsTailId: "link2",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
  {
    line: 7,
    description: "Re-run 结束。链表完全复用，零内存分配，性能最优",
    operationType: "FINISH",
    state: {
      ...INITIAL_STATE,
      highlightedLine: 7,
      activeSubId: undefined,
      refs: {
        ref_flag: {
          id: "ref_flag",
          name: "flag",
          value: false,
          subsHeadId: "link1",
          subsTailId: "link1",
        },
        ref_count: {
          id: "ref_count",
          name: "count",
          value: 0,
          subsHeadId: "link2",
          subsTailId: "link2",
        },
      },
      effects: {
        eff_1: {
          id: "eff_1",
          name: "effect",
          depsHeadId: "link1",
          depsTailId: "link2",
        },
      },
      links: {
        link1: {
          id: "link1",
          depId: "ref_flag",
          subId: "eff_1",
          nextDepId: "link2",
        },
        link2: {
          id: "link2",
          depId: "ref_count",
          subId: "eff_1",
          prevDepId: "link1",
        },
      },
    },
  },
];
