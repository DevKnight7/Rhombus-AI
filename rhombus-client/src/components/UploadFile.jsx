import React, { useCallback, useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import "./UploadFile.css";
import { useDispatch } from "react-redux";
import { setData } from "../state/index";
import UploadFileImage from "../assets/upload.png";
import "../Global.css";

const override = {
  position: "fixed",
  display: "flex",
  justifycontent: "center",
  alignitems: "center",
  borderColor: "#75b5ff",
};

export default function UploadFile() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();

  const handleDataReceived = (data) => {
    dispatch(setData(data));
  };

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
        const apiUrl = "http://127.0.0.1:8000/data/process/";

        const formData = new FormData();
        formData.append("file", uploadedFile);

        // Make API call to send the file
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (response.status === 200) {
          var data = await response.json();
          toast.success("File parsed successfully!");
          handleDataReceived(data);
        } else {
          console.error("API call error:", response);
          toast.error("Error submitting the file. Please try again.");
        }
      } catch (error) {
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
    <>
      <ClipLoader
        loading={submitting}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="flex-col algn-cent upload-container">
        <div className="flex-col algn-cent py-2" {...getRootProps()}>
          <ToastContainer />
          <input {...getInputProps()} />
          <div>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
          </div>
          {uploadedFile == null && (
            <img
              className="upload-img"
              src={UploadFileImage}
              alt={"Upload file"}
            />
          )}
          {uploadedFile !== null && (
            <div className="flex-row algn-cent">
              <div className="uploaded-file algn-cent">
                <p>Uploaded file:</p>

                <p className="file-name">{uploadedFile.name}</p>
              </div>
            </div>
          )}
        </div>
        {uploadedFile !== null && (
          <button className="btn-primary mb-1" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </>
  );
}
