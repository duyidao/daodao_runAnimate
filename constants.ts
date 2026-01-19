import { Category } from "@/types/navigationOverlay";
import {
  ObjectLoopCode,
  ObjectLoopSteps,
} from "./views/js/objectLoop/constants";
import {
  PromiseCancelCode,
  PromiseStatusSteps,
} from "./views/js/promiseCancel/constants";
import {
  EffectRefLinkCode,
  EffectRefLinkSteps,
} from "./views/vue/effectRefLink/constants";
import { AsyncOnceCode, AsyncOnceSteps } from "@/views/js/asyncOnce/constants";
import { LruCode, LruCodeSteps } from "@/views/js/lru/constants";

export const CATEGORIES: Category[] = [
  {
    id: "js",
    name: "JavaScript",
    icon: "javascript",
    scenarios: [
      {
        id: "promise-cancel",
        path: "/js/promiseCancel",
        name: "Promise 竞态取消",
        description:
          "Tab 频繁切换时，容易造成新接口比旧接口早响应，导致页面数据是旧数据。灵活运用竞态取消思想，高效优雅解决该问题。",
        tag: ["Promise", "频繁切换", "请求取消"],
        code: PromiseCancelCode,
        steps: PromiseStatusSteps,
      },
      {
        id: "async-once",
        path: "/js/asyncOnce",
        name: "异步请求复用逻辑",
        description:
          "Tab 频繁切换时，容易造成新接口比旧接口早响应，导致页面数据是旧数据。灵活运用竞态取消思想，高效优雅解决该问题。",
        tag: ["Promise", "频繁切换", "请求取消"],
        code: AsyncOnceCode,
        steps: AsyncOnceSteps,
      },
      {
        id: "object-loop",
        path: "/js/objectLoop",
        name: "对象循环引用判断",
        description:
          "判断对象是否存在循环引用，常用在对象深拷贝、循环引用检测等场景。",
        tag: ["循环引用", "集合判断"],
        code: ObjectLoopCode,
        steps: ObjectLoopSteps,
      },
      {
        id: "lru-cache",
        path: "/js/lru",
        name: "LRU 缓存算法",
        description:
          "LRU 缓存算法，用于缓存最近使用的数据，当缓存满时，淘汰最近最少使用的数据。",
        tag: ["缓存", "最近最少使用"],
        code: LruCode,
        steps: LruCodeSteps,
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
        path: "/vue/effectRefLink",
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
