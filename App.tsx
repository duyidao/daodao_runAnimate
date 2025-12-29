import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/objectLoop/index";
import EffectRefLink from "@/views/effectRefLink/index";
import PromiseCancel from "@/views/promiseCancel/index";
import AppLayout from "@/layout/index";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/objectLoop" element={<ObjectLoop />} />
          <Route path="/effectRefLink" element={<EffectRefLink />} />
          <Route path="/promiseCancel" element={<PromiseCancel />} />
        </Route>
      </Routes>
    </Router>
  );
}
