import React, { useState, useEffect } from 'react';
import './ProcessingStatus.css';

const ProcessingStatus = ({ jobId, onComplete, onError }) => {
  const [status, setStatus] = useState('queued');
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState(null);
  
  // Status progress mapping
  const statusProgress = {
    'queued': 10,
    'extracting_audio': 30,
    'transcribing': 50,
    'summarizing': 70,
    'completed': 100,
    'error': 100
  };
  
  // Status text mapping
  const statusMessages = {
    'queued': 'Job queued, waiting to begin processing...',
    'extracting_audio': 'Extracting audio from YouTube video...',
    'transcribing': 'Transcribing audio to text using Whisper AI...',
    'summarizing': 'Generating summary and key points...',
    'completed': 'Processing completed!',
    'error': 'An error occurred'
  };

  // Poll for job status
  useEffect(() => {
    if (!jobId) return;
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/job/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job status');
        }
        
        const data = await response.json();
        setStatus(data.status);
        
        // Update progress based on status
        setProgress(statusProgress[data.status] || 0);
        
        // Handle completed job
        if (data.status === 'completed') {
          onComplete(data);
        }
        
        // Handle error
        if (data.status === 'error') {
          setError(data.error || 'An unknown error occurred');
          onError(data.error || 'An unknown error occurred');
        }
        
      } catch (error) {
        setError(`Failed to check job status: ${error.message}`);
        onError(`Failed to check job status: ${error.message}`);
      }
    };
    
    // Check immediately then set interval
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [jobId, onComplete, onError]);

  return (
    <div className="processing-status-container">
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Processing Your Podcast</h4>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
          ) : (
            <>
              <div className="status-info">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <div>
                    <strong>Status:</strong> <span className={`status-text status-${status}`}>{statusMessages[status]}</span>
                  </div>
                </div>
              </div>
              <div className="progress mt-4">
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  style={{ width: `${progress}%` }} 
                  aria-valuenow={progress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="text-center mt-4">
                <p className="processing-info">
                  {status === 'extracting_audio' && "We're downloading the audio from YouTube..."}
                  {status === 'transcribing' && "Our AI is converting speech to text..."}
                  {status === 'summarizing' && "Almost there! Creating your summary..."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;