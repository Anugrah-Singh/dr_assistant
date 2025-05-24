import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ...existing code...

const PreQuestion = () => {
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate(); // added useNavigate hook

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    navigate("/upload"); // redirect to /upload when language is chosen
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
      {/* ...existing code... */}
      <select 
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer hover:bg-gray-50"
        value={language} 
        onChange={handleLanguageChange}
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Kannada">Kannada</option>
      </select>
      {/* ...existing code... */}
    </div>
  );
};

export default PreQuestion;
