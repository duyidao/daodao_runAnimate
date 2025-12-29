import { Category } from "@/types/navigationOverlay";
import { ObjectLoopCode, ObjectLoopSteps } from "./views/objectLoop/constants";
import {
  EffectRefLinkCode,
  EffectRefLinkSteps,
} from "./views/effectRefLink/constants";

export const CATEGORIES: Category[] = [
  {
    id: "js",
    name: "JavaScript",
    icon: "javascript",
    scenarios: [
      {
        id: "promise-cancel",
        path: "/promiseCancel",
        name: "Promise 竞态取消",
        description:
          "Tab 频繁切换时，容易造成新接口比旧接口早响应，导致页面数据是旧数据。灵活运用竞态取消思想，高效优雅解决该问题。",
        tag: ["Promise", "频繁切换", "请求取消"],
        code: ObjectLoopCode,
        steps: ObjectLoopSteps,
      },
      {
        id: "object-loop",
        path: "/objectLoop",
        name: "对象循环引用判断",
        description:
          "判断对象是否存在循环引用，常用在对象深拷贝、循环引用检测等场景。",
        tag: ["循环引用", "集合判断"],
        code: ObjectLoopCode,
        steps: ObjectLoopSteps,
      },
    ],
  },
  {
    id: "vue",
    name: "Vue",
    icon: "vuedotjs",
    scenarios: [
      {
        id: "vue-ref-effect",
        path: "/effectRefLink",
        name: "Ref 与 Effect 追踪",
        tag: ["dep", "sub", "双向链表", "节点复用"],
        description:
          "Vue 中 Ref 与 Effect 之间的依赖关系，通过双向链表实现。当 Ref 变化时，会触发相关 Effect 重新执行。",
        code: EffectRefLinkCode,
        steps: EffectRefLinkSteps,
      },
    ],
  },
];
