import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/js/objectLoop/index";
import EffectRefLink from "@/views/vue/effectRefLink/index";
import PromiseCancel from "@/views/js/promiseCancel/index";
import AsyncOnce from "@/views/js/asyncOnce/index";
import AppLayout from "@/layout/index";
import { debounce } from "lodash-es";

const getFontSize = () => {
  document.documentElement.style.fontSize = `${Math.max(
    12,
    Math.min(window.innerWidth / 100, 20)
  )}px`;
};
getFontSize();
window.addEventListener(
  "resize",
  debounce(() => getFontSize(), 100)
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/objectLoop" element={<ObjectLoop />} />
          <Route path="/effectRefLink" element={<EffectRefLink />} />
          <Route path="/asyncOnce" element={<AsyncOnce />} />
          <Route path="/promiseCancel" element={<PromiseCancel />} />
        </Route>
      </Routes>
    </Router>
  );
}
