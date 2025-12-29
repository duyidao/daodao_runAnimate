import { Category, PromiseStatus } from "../../types/navigationOverlay";
import { ObjectLoopCode, ObjectLoopSteps } from "./views/objectLoop/constants";
import {
  EffectRefLinkCode,
  EffectRefLinkSteps,
} from "./views/effectRefLink/constants";

export const CATEGORIES: Category[] = [
  {
    id: "js",
    name: "JavaScript",
    icon: 'javascript',
    scenarios: [
      {
        id: "promise-cancel",
        path: '/promiseCancel',
        name: "Promise 竞态取消",
        description: "Tab 频繁切换时，容易造成新接口比旧接口早响应，导致页面数据是旧数据。灵活运用竞态取消思想，高效优雅解决该问题。",
        tag: ['Promise', '频繁切换', '请求取消'],
        code: ObjectLoopCode,
      },
      {
        id: "object-loop",
        path: '/objectLoop',
        name: "对象循环引用判断",
        description: "Tab 频繁切换时，容易造成新接口比旧接口早响应，导致页面数据是旧数据。灵活运用竞态取消思想，高效优雅解决该问题。",
        tag: ['循环引用', '集合判断'],
        code: ObjectLoopCode,
        step: ObjectLoopSteps,
      },
    ],
  },
  {
    id: "vue",
    name: "Vue",
    icon: 'vuedotjs',
    scenarios: [
      {
        id: "vue-ref-effect",
        path: '/effectRefLink',
        name: "Ref 与 Effect 追踪",
        tag: ['dep', 'sub', '双向链表', '节点复用'],
        code: EffectRefLinkCode,
        step: EffectRefLinkSteps,
      },
    ],
  },
];
