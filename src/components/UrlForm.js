import React, { useState } from 'react';
import './UrlForm.css';

const UrlForm = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // YouTube URL validation
  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return youtubeRegex.test(url.trim());
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setIsValid(true);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      setIsValid(false);
      setErrorMessage('Please enter a YouTube URL');
      return;
    }
    
    if (!isValidYoutubeUrl(url)) {
      setIsValid(false);
      setErrorMessage('Please enter a valid YouTube URL');
      return;
    }
    
    // Submit the URL
    setIsLoading(true);
    
    try {
      // Make API call (would typically use a service like api.js)
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Call the onSubmit prop with the job ID
      onSubmit(data.job_id);
    } catch (error) {
      setIsValid(false);
      setErrorMessage(`Failed to submit URL: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="url-form-container">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Summarize a YouTube Podcast</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="youtube-url" className="form-label">
                YouTube URL
              </label>
              <input
                type="url"
                className={`form-control ${!isValid ? 'is-invalid' : ''}`}
                id="youtube-url"
                placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                value={url}
                onChange={handleUrlChange}
                disabled={isLoading}
                required
              />
              {!isValid && (
                <div className="invalid-feedback">{errorMessage}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                'Summarize'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UrlForm;