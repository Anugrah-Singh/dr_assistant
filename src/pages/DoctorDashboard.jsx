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
  CheckCircle,
  FileText // Added for summary icon
} from 'lucide-react';

const doctorName = "Dr. Smith"; // This remains static as per current design

function DoctorDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // Status filtering logic is not implemented with new data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || dateString.toLowerCase() === 'none') {
      return 'N/A';
    }
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return 'N/A'; // Or display original string: dateString;
    }
    return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_PATIENT_API_URL}/get_detailed_reports`);
        console.log('Backend response:', response.data); // Added console.log
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();    
  }, []);

  useEffect(() => {
    let filtered = reports.filter(report => {
      const term = searchTerm.toLowerCase();
      // Updated fields for searching
      const patientNameMatch = report.patient_name && report.patient_name.toLowerCase().includes(term);
      const summaryMatch = report.summary && report.summary.toLowerCase().includes(term);
      const idMatch = report._id && report._id.toLowerCase().includes(term);
      // Removed doctorNameMatch as it's not in the report object
      return patientNameMatch || summaryMatch || idMatch;
    });

    if (filterStatus !== 'all') {
      // Status filtering logic would need to be adapted if 'status' field were available in reports
      // For now, this part remains non-functional for status filtering
    }

    setFilteredReports(filtered);
  }, [searchTerm, filterStatus, reports]);

  const handlePatientClick = (reportId) => {
    // Assuming report._id is the correct identifier for PatientDetails page
    navigate(`/PatientDetails/${reportId}`);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Stats might need re-evaluation based on what 'reports.length' signifies
  const stats = [
    { label: 'Total Reports', value: reports.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Reports Logged', value: reports.length, icon: Calendar, color: 'bg-green-500' }, // Changed label
    // These are example stats, their meaning might change with new data
    { label: 'Summaries to Review', value: Math.floor(reports.length * 0.3), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Archived Reports', value: Math.floor(reports.length * 0.7), icon: CheckCircle, color: 'bg-purple-500' },
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
                You have {reports.length} reports in the system.
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
            <h2 className="text-2xl font-bold text-gray-800">Detailed Patient Reports</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Filter Dropdown (currently not functional for status) */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Reports</option>
                  {/* Add other status options if applicable and data supports it */}
                </select>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reports found</p>
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <div
                  key={`${report._id}-${index}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handlePatientClick(report._id)} // Use report._id
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" /> {/* Changed icon to User */}
                      </div>
                      
                      {/* Report Info */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {report.patient_name || 'N/A'} {/* Display patient_name */}
                        </h3>
                        <div className="flex flex-col space-y-1 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
                            DOB: {formatDate(report.date_of_birth)} {/* Display date_of_birth */}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1.5 text-indigo-500" />
                            Doctor: {doctorName} {/* Use static doctorName */}
                          </span>
                           <span className="flex items-center"> {/* Added gender */}
                            <Users className="h-4 w-4 mr-1.5 text-indigo-500" />
                            Gender: {report.gender || 'N/A'}
                          </span>
                          <span className="flex items-center mt-1">
                            <FileText className="h-4 w-4 mr-1.5 text-indigo-500 flex-shrink-0" />
                            <span className="truncate" title={report.summary}>
                              Summary: {report.summary ? report.summary.substring(0, 60) + (report.summary.length > 60 ? '...' : '') : 'N/A'}
                            </span>
                          </span>
                           <span className="text-xs text-gray-400 mt-1">Report ID: {report._id ? report._id.slice(-8) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
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