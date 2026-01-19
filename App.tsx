import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ObjectLoop from "@/views/js/objectLoop/index";
import EffectRefLink from "@/views/vue/effectRefLink/index";
import PromiseCancel from "@/views/js/promiseCancel/index";
import LruCache from "@/views/js/lru/index"; // LRU 缓存算法
import AsyncOnce from "@/views/js/asyncOnce/index";
import AppLayout from "@/layout/index";
import { debounce } from "lodash-es";

const getFontSize = () => {
  document.documentElement.style.fontSize = `${Math.max(
    10,
    Math.min(window.innerWidth / 100, 22),
  )}px`;
};
getFontSize();
window.addEventListener(
  "resize",
  debounce(() => getFontSize(), 100),
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/js/objectLoop" replace />} />
          <Route path="/js/objectLoop" element={<ObjectLoop />} />
          <Route path="/vue/effectRefLink" element={<EffectRefLink />} />
          <Route path="/js/asyncOnce" element={<AsyncOnce />} />
          <Route path="/js/promiseCancel" element={<PromiseCancel />} />
          <Route path="/js/lru" element={<LruCache />} />
        </Route>
      </Routes>
    </Router>
  );
}
