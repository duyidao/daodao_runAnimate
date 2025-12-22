import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/objectLoop/index";
import EffectRefLink from "@/views/effectRefLink/index";
import AppLayout from "@/layout/index";
import { ObjectLoopCode, ObjectLoopSteps } from "./views/objectLoop/constants";
import {
  EffectRefLinkCode,
  EffectRefLinkSteps,
} from "./views/effectRefLink/constants";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/objectLoop"
          element={
            <AppLayout
              animateCode={ObjectLoopCode}
              animateStep={ObjectLoopSteps}
            >
              <ObjectLoop />
            </AppLayout>
          }
        />
        <Route
          path="/effectRefLink"
          element={
            <AppLayout
              animateCode={EffectRefLinkCode}
              animateStep={EffectRefLinkSteps}
            >
              <EffectRefLink />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
