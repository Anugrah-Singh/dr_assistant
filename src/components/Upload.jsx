import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

export function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();  // Initialize navigate

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);  // Append each file
    });

    try {
      setUploading(true);
      const response = await axios.post("http://192.168.137.79:8000/api/extract-aadhaar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", response.data);
      alert("File uploaded successfully!");
      
      // Redirect to another page after successful upload
      navigate("/chatbot"); 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-8 shadow-md">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer p-12 flex flex-col items-center justify-center text-center text-neutral-600 dark:text-neutral-300 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-lg font-medium mb-1">
          {uploading ? "Uploading..." : "Drop files here or click to browse"}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Support for multiple files
        </span>
      </label>

      {files.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h2 className="font-bold mb-3 text-neutral-800 dark:text-neutral-200">Uploaded Files:</h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center p-2 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
