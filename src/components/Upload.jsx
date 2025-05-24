import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  CloudUpload,
  File
} from "lucide-react";

export function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });
    
    setFiles(validFiles);
    setUploadStatus(null);
  };

  const handleFileUpload = async (event) => {
    if (event?.target?.files) {
      handleFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submitFiles = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadStatus(null);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post("http://192.168.137.79:8000/api/extract-aadhaar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      console.log("Upload successful:", response.data);
      
      setTimeout(() => {
        navigate("/chatbot");
      }, 1500);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus('error');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-4">Upload Medical Documents</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload patient documents including Aadhaar cards, medical reports, and other relevant files. 
            We support JPEG, PNG, and PDF formats up to 10MB each.
          </p>
        </div>

        {/* Upload Area */}
        <div className="card rounded-2xl p-8 animate-slide-up">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
              dragActive 
                ? 'border-indigo-400 bg-indigo-50' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
            />
            
            <div className="text-center">
              <div className="mx-auto mb-6">
                <CloudUpload className={`h-16 w-16 mx-auto transition-colors ${
                  dragActive ? 'text-indigo-500' : 'text-gray-400'
                }`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {dragActive ? 'Drop files here' : 'Choose files or drag and drop'}
              </h3>
              
              <p className="text-gray-500 mb-4">
                JPEG, PNG, PDF up to 10MB each
              </p>
              
              <button
                type="button"
                className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload className="h-5 w-5" />
                <span>Browse Files</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="card rounded-xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Selected Files ({files.length})</h3>
              <button
                onClick={() => setFiles([])}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      {file.type.includes('pdf') ? (
                        <FileText className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <File className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors group"
                  >
                    <X className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploading...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700 font-medium">Files uploaded successfully! Redirecting...</span>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 font-medium">Upload failed. Please try again.</span>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={submitFiles}
              disabled={uploading || files.length === 0}
              className="w-full btn-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="h-5 w-5" />
                  <span>Upload {files.length} {files.length === 1 ? 'File' : 'Files'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card rounded-xl p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Upload</h3>
            <p className="text-gray-600 text-sm">All files are encrypted and securely processed</p>
          </div>
          
          <div className="card rounded-xl p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto Processing</h3>
            <p className="text-gray-600 text-sm">Documents are automatically processed and analyzed</p>
          </div>
          
          <div className="card rounded-xl p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">Support for JPEG, PNG, and PDF files</p>
          </div>
        </div>
      </div>
    </div>
  );
}
