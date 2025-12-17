import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ObjectLoop from '@/views/objectLoop/index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/objectLoop" element={<ObjectLoop />} />
      </Routes>
    </Router>
  );
}