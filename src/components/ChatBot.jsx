import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, AlertTriangle, User, Bot } from 'lucide-react';
import { useParams } from 'react-router-dom';

const MedicalChatbot = () => {
  const [context, setContext] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  // Get patient_id from URL params
  const { patient_id } = useParams();

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch patient details using patient_id from URL
    if (patient_id) {
      axios.get(`http://192.168.28.205:5000/get_detailed_report/${patient_id}`)
        .then(response => {
          setPatientDetails(response.data);
          
          // Set context with detailed history and summary
          const contextText = `
            Patient Details:
            Name: ${response.data.patient_name}
            Age: ${calculateAge(response.data.date_of_birth)}
            Gender: ${response.data.gender}
            Medical History: ${response.data.medical_history}
            Current Medical Condition: ${response.data.medical_condition}
            Detailed History: ${response.data.detailed_history}
            Summary: ${response.data.summary}
          `;
          
          setContext(contextText);
        })
        .catch(err => {
          console.error("Failed to fetch patient details", err);
          setError('Unable to load patient details');
        });
    }
  }, [patient_id]);

  // Helper function to calculate age
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    // Only scroll when new messages are added, not on initial load
    if (conversation.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const sendMessage = async () => {
    if (!context.trim()) {
      setError('Please provide patient context first');
      return;
    }
    if (!userInput.trim()) {
      setError('Please enter a message');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const updatedConversation = [ ...conversation, { role: 'user', content: userInput } ];
      const response = await axios.post('http://192.168.137.73:8080/chat', {
        context,
        conversation: updatedConversation
      });
      setConversation(response.data.conversation);
      setUserInput('');
    } catch (err) {
      if (axios.isAxiosError && axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.error || 'An unexpected error occurred';
        setError(errorMsg);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header with Patient Name */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold flex items-center">
          <Bot className="mr-2" />
          Medical Chatbot Assistant 
          {patientDetails && ` - ${patientDetails.patient_name}`}
        </h1>
      </div>

      {/* Chat Messages Section */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
        {conversation.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'}`}
          >
            <div className="flex-shrink-0">
              {msg.role === 'user' ? (
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <User size={18} />
                </div>
              ) : (
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <Bot size={18} />
                </div>
              )}
            </div>
            <div 
              className={`
                max-w-[80%] p-3 rounded-lg shadow-sm 
                ${msg.role === 'user' 
                  ? 'bg-blue-100 text-blue-900 rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border'}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Error Handling */}
      {error && (
        <div className="absolute bottom-20 left-0 right-0 mx-4 z-50">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-md flex items-center">
            <AlertTriangle className="mr-3 text-red-500" size={24} />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Message Input Section */}
      <div className="p-4 bg-white border-t shadow-inner">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your medical query..."
            className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-none"
            rows={1}
            disabled={isLoading || !context.trim()}
          />
          <button
            type="submit"
            disabled={isLoading || !context.trim() || !userInput.trim()}
            className="
              bg-blue-500 text-white p-3 rounded-full 
              hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-300 shadow-md hover:shadow-lg
              flex items-center justify-center
            "
          >
            {isLoading ? (
              <div className="animate-spin">🔄</div>
            ) : (
              <Send size={24} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalChatbot;