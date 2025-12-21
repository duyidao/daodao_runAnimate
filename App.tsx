import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/objectLoop/index";
import AppLayout from "@/layout/index";
import { DEMO_CODE, DEMO_STEPS } from "./views/objectLoop/constants";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/objectLoop"
          element={
            <AppLayout animateCode={DEMO_CODE} animateStep={DEMO_STEPS}>
              <ObjectLoop />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
