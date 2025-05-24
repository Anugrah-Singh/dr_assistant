import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const doctorName = "Dr. Smith";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await axios.get('http://192.168.28.205:5000/get_n_appointments/661abcd123456789abcdef00');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();    
  }, []);

  // Handler to navigate to patient details
  const handlePatientClick = (patientId) => {
    navigate(`/PatientDetails/${patientId}`);
  };

  return (
    <div className="p-5 max-w-3xl mx-auto font-sans">
      <h1 className="text-gray-800 border-b-2 border-blue-500 pb-2.5 mb-5">Hello, {doctorName}!</h1>
      <ul className="list-none p-0">
        {appointments.map((appointment, index) => (
          <li 
            key={`${appointment._id}-${index}`} 
            className="bg-gray-50 rounded-lg p-4 mb-4 shadow hover:shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
            onClick={() => handlePatientClick(appointment.patient_id)} // Use the patient_id here
          >
            <div className="mb-2 text-gray-800"><span className="text-blue-500 font-bold mr-1">ID:</span> {appointment._id}</div>
            <div className="mb-2 text-gray-800"><span className="text-blue-500 font-bold mr-1">Name:</span> {appointment.name}</div>
            <div className="mb-2 text-gray-800"><span className="text-blue-500 font-bold mr-1">Age:</span> {appointment.age}</div>
            <div className="mb-2 text-gray-800"><span className="text-blue-500 font-bold mr-1">Sex:</span> {appointment.sex}</div>
            <div className="my-2.5">
              <hr className="border-none h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorDashboard;