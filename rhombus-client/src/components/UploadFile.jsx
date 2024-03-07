import React, { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import "./UploadFile.css";

export default function UploadFile() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const validFileTypes = [
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isValidFileType =
      acceptedFiles.length === 1 &&
      validFileTypes.includes(acceptedFiles[0].type);

    if (isValidFileType) {
      setUploadedFile(acceptedFiles[0]);
      toast.success("File Uploaded successfully!");
    } else {
      if (acceptedFiles.length > 1) {
        setUploadedFile(null);
        toast.error("Please upload only one file.");
      } else {
        setUploadedFile(null);
        toast.error("Invalid file type. Please upload a CSV or Excel file.");
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (uploadedFile) {
      setSubmitting(true);

      try {
        // Replace with your actual API endpoint
        const apiUrl = "http://127.0.0.1:8000/data/process/";

        const formData = new FormData();
        formData.append('file', uploadedFile); // 'file' should match the name expected by your Django view

        // Make API call to send the file
        const response = await fetch(apiUrl, {
          method: "POST", // Adjust the method as needed (POST, GET, etc.)
          body: formData, // Send FormData object
        });

        // Check if the response is successful (status code 2xx)
        if (response.ok) {
          var data = await response.json();
          toast.success("File submitted successfully!");
          console.log("response",data)
        } else {
          // Handle API call error
          console.error("API call error:", response);
          toast.error("Error submitting the file. Please try again.");
        }
      } catch (error) {
        // Handle other errors
        console.error( error);
        toast.error("Error submitting the file. Please try again.");
      } finally {
        setSubmitting(false);
        setUploadedFile(null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div>
      <div className="upload-container" {...getRootProps()}>
        <ToastContainer />
        <input {...getInputProps()} />
        <div className={`dropzone ${isDragActive ? "active" : ""}`}>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag 'n' drop CSV or Excel files here, or click to select files
            </p>
          )}
        </div>
        {uploadedFile !== null && (
          <div>
            <div className="uploaded-file">
              <p>Uploaded file:</p>
              <p>{uploadedFile.name}</p>
            </div>
          </div>
        )}
      </div>
      {uploadedFile !== null && <button onClick={handleSubmit}>Submit</button>}
    </div>
  );
}
