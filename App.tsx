import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/objectLoop/index";
import EffectRefLink from "@/views/effectRefLink/index";
import AppLayout from "@/layout/index";

export default function App() {
  return (
    <Router>
    <AppLayout>
      <Routes>
        <Route
          path="/objectLoop"
          element={
            // <AppLayout
            //   animateCode={ObjectLoopCode}
            //   animateStep={ObjectLoopSteps}
            // >
              <ObjectLoop />
            // </AppLayout>
          }
        />
        <Route
          path="/effectRefLink"
          element={
            // <AppLayout
            //   animateCode={EffectRefLinkCode}
            //   animateStep={EffectRefLinkSteps}
            // >
              <EffectRefLink />
            // </AppLayout>
          }
        />
      </Routes>
            </AppLayout>
    </Router>
  );
}
