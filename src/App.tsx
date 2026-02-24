import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./Components/Dashboard";
import AdminPanel from "./Components/AdminPanel";
import PhysicsTopicsPage from "./Components/PhysicsTopicsPage";
import ChemistryTopicPage from "./Components/ChemistryTopicPage";
import BiologyTopicPages from "./Components/BiologyTopicPages";
import Home from "./Pages/Home";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import PracticalExperiment from "./Components/PracticalExperiment";
import FaradaySimulation from "./Experiments/FaradaySimulation";
import { OhmsLawVirtualLab } from "./Experiments/OhmsLawVirtualLab";
import ChemicalReactionsInteractiveLabhem from "./Experiments/ChemicalReactionsInteractiveLab";
import AcidBaseLabPro from "./Experiments/AcidBaseLabPro";
import SoapCleansingActionLab from "./Experiments/SoapCleansingActionLab";
import PhotosynthesisVirtualLab from "./Experiments/PhotosynthesisVirtualLab";
import RespirationLab from "./Experiments/RespirationLab";
import Series from "./Experiments/Series";
import StarchTestLab from "./Experiments/StarchTestLab";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />

            {/* Subject pages */}
            <Route path="/physics" element={<PhysicsTopicsPage />} />
            <Route path="/chemistry" element={<ChemistryTopicPage />} />
            <Route path="/biology" element={<BiologyTopicPages />} />

            {/* Experiments */}
            <Route path="/allexp/:id" element={<PracticalExperiment />} />
            <Route path="/faradayLaw" element={<FaradaySimulation />} />
            <Route path="/ohmsLaw" element={<OhmsLawVirtualLab />} />
            <Route path="/PhSeries" element={<Series/>} />
            <Route path="/chemicalrxn" element={<ChemicalReactionsInteractiveLabhem />} />
            <Route path="/AcidBase" element={<AcidBaseLabPro />} />
            <Route path="/soap" element={<SoapCleansingActionLab />} />
            <Route path="/photosynthesis" element={<PhotosynthesisVirtualLab />} />
            <Route path="/Respiration" element={<RespirationLab />} />
            <Route path="/starchtest" element={<StarchTestLab/>} /> 

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}