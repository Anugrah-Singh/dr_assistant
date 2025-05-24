import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  Search,
  Filter,
  Users,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const doctorName = "Dr. Smith";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.28.205:5000/get_n_appointments/661abcd123456789abcdef00');
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();    
  }, []);

  useEffect(() => {
    let filtered = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'all') {
      // You can add status filtering logic here if your API provides status
      // filtered = filtered.filter(appointment => appointment.status === filterStatus);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, appointments]);

  const handlePatientClick = (patientId) => {
    navigate(`/PatientDetails/${patientId}`);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Total Patients', value: appointments.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Today\'s Appointments', value: appointments.length, icon: Calendar, color: 'bg-green-500' },
    { label: 'Pending Reviews', value: Math.floor(appointments.length * 0.3), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Completed', value: Math.floor(appointments.length * 0.7), icon: CheckCircle, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="card rounded-2xl p-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {getTimeGreeting()}, {doctorName}!
              </h1>
              <p className="text-gray-600 text-lg">
                You have {appointments.length} appointments today. Keep up the excellent work!
              </p>
            </div>
            <div className="hidden md:block">
              <Activity className="h-16 w-16 text-indigo-400 animate-float" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.label} className="card rounded-xl p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="card rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Today's Appointments</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No appointments found</p>
              </div>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <div
                  key={`${appointment._id}-${index}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handlePatientClick(appointment.patient_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Patient Info */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {appointment.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Age {appointment.age} • {appointment.sex}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            ID: {appointment._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="flex items-center space-x-3">
                      <div className="hidden sm:flex items-center space-x-2">
                        <span className="text-sm text-gray-500">View Details</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;