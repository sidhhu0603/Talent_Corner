import React, { useState } from 'react';
import axios from 'axios';
import Upload from '../Images/upload.png';
import './ExcelUploader.css';

const ExcelUploader = ({ sidebarOpen }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // State to hold the file name

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ''); // Update the file name state
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post('https://talent-corner.onrender.com/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      console.log('Server response:', response.data);
      setFile(null); // Clear selected file after upload
      setFileName(''); // Clear file name after upload
      document.getElementById('file-7').value = ''; // Clear the input field by resetting the value
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className={sidebarOpen ? "page-content" : "page-content shifted"}>
      <div className="header">
        <img src={Upload} alt="Header Image" />
        <div className="header-text">Upload Your File</div>
      </div>
      <div className="upload-container">
        <div className="box">
          <input
            type="file"
            name="file-7[]"
            id="file-7"
            className="inputfile inputfile-6"
            onChange={handleFileChange}
          />
          <label htmlFor="file-7">
            <span>{fileName}</span> {/* Display the selected file name */}
            <strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="17"
                viewBox="0 0 20 17"
              >
                <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
              </svg> Choose a file…
            </strong>
          </label>
          {file && (
            <div className="upload-button-container">
              <button className="upload-button" onClick={handleUpload}>
                Upload The File
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default ExcelUploader;
