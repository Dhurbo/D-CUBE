import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import CorrectionPage from './pages/CorrectionPage'
import HomePage from './pages/HomePage'
import ManualInputPage from './pages/ManualInputPage'
import SolutionPage from './pages/SolutionPage'
import UploadPage from './pages/UploadPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/manual" element={<ManualInputPage />} />
          <Route path="/correction" element={<CorrectionPage />} />
          <Route path="/solution" element={<SolutionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
