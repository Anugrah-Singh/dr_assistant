import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import
import MedicalChatbot from "../components/Chatbot";

function PatientDetails() {
	const [patientData, setPatientData] = useState(null);
	const [error, setError] = useState(null);
	const { patient_id } = useParams(); // Get patient_id from URL params
  
	async function getPatientData() {
		try {
			const response = await axios.get(`http://192.168.28.205:5000/get_detailed_report/${patient_id}`);
			console.log("Patient data:", response.data);
			setPatientData(response.data);
		} catch (error) {
			console.error("Error fetching patient data:", error);
			setError("Failed to load patient data");
		}
	}
  
	useEffect(() => {
		if (patient_id) {
			getPatientData();
		}
	}, [patient_id]);
  
	if (error) {
		return <div className="text-center py-10 text-red-500">{error}</div>;
	}

	return (
		<div className="max-w-3xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
			{patientData ? (
				<div>
					<h1 className="text-slate-800 border-b-2 border-blue-500 pb-2 mb-5">
						{patientData.patient_name}
					</h1>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
						<p className="my-2"><span className="text-blue-600 font-bold">Patient ID:</span> {patientData.patient_id}</p>
						<p className="my-2"><span className="text-blue-600 font-bold">Blood Group:</span> {patientData.blood_group}</p>
						<p className="my-2"><span className="text-blue-600 font-bold">Contact Info:</span> {patientData.contact_info}</p>
						<p className="my-2"><span className="text-blue-600 font-bold">Date of Birth:</span> {patientData.date_of_birth}</p>
						<p className="my-2"><span className="text-blue-600 font-bold">Gender:</span> {patientData.gender}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Medical Condition
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.medical_condition)}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Medical History
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.medical_history)}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Patient Summary
						</h2>
						<p className="my-2 leading-relaxed">{patientData.summary}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Current Medication
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.current_medication)}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Detailed History
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.detailed_history)}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Lifestyle Risk Factors
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.lifestyle_risk_factors)}</p>
					</div>
					
					<div className="p-4 bg-white rounded-md shadow-sm mb-5">
						<h2 className="text-slate-800 border-b border-gray-200 pb-2 text-xl">
							Test Results
						</h2>
						<p className="my-2 leading-relaxed">{JSON.stringify(patientData.test_results)}</p>
					</div>
					
					{/* Render the chatbot here */}
					<div className="mt-8">
						<MedicalChatbot />
					</div>
				</div>
			) : (
				<p className="text-center py-10 text-lg text-gray-500">
					Loading patient data...
				</p>
			)}
		</div>
	);
}

export default PatientDetails;
