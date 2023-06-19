import React, { useState, useEffect } from 'react';

import { Amplify, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await Storage.list('', { pageSize : 'ALL' });
      const files = response.results.map((file) => ({
        key: file.key,
        url: `https://bucketName.s3.amazonaws.com/public/${file.key}` // Replace 'bucketName' with your actual S3 bucket name
      }));
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      alert('Error fetching uploaded files. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    try {
      await Storage.put(selectedFile.name, selectedFile);
      alert('File uploaded successfully.');
      fetchUploadedFiles(); // Fetch the updated list of uploaded files
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <div>
      <h1>File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadedFiles.length > 0 && (
        <div>
          <h2>Uploaded Files:</h2>
          <div className="file-cards">
            {uploadedFiles.map((file) => (
              <div key={file.key} className="file-card">
                <img src={file.url} alt={file.key} className="file-image" />
                <p className="file-name">{file.key}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
