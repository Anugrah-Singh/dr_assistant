import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileUploadDemo } from "./components/Upload";
import PatientDetails from "./pages/PatientDetails"; // Import the Chatbot page
import Header from "./components/Header"; // Import the Header component
import PreQuestion from "./pages/PreQuestion";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Render header */}
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PreQuestion />} />
        <Route path="/upload" element={<FileUploadDemo />} />
        <Route path="/PatientDetails/:patient_id" element={<PatientDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
