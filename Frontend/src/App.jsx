import { HierarchyAnalysis } from './Pages'
import { Routes, Route } from "react-router-dom";
import './App.css'


function App() {
  return (
    <Routes>
      <Route path="HAM" element={<HierarchyAnalysis/>}/>
    </Routes>
  )
}

export default App
