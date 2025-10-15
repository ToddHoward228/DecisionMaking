import { HierarchyAnalysis } from "./Pages";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <main>
      <Routes>
        <Route path="HAM" element={<HierarchyAnalysis />} />
      </Routes>
    </main>
  );
}

export default App;
