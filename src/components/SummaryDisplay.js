import React from 'react';
import './SummaryDisplay.css';

const SummaryDisplay = ({ summaryData, onReset }) => {
  const { paragraph_summary, bullet_points, url, completed_at } = summaryData || {};
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Extract video ID for thumbnail
  const getVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = getVideoId(url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <div className="summary-display-container">
      <div className="card shadow main-card">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Podcast Summary</h4>
        </div>
        <div className="card-body">
          {thumbnailUrl && (
            <div className="video-thumbnail mb-4">
              <img 
                src={thumbnailUrl} 
                alt="Video thumbnail" 
                className="img-fluid rounded"
              />
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="watch-button"
              >
                <i className="fas fa-play-circle"></i>
              </a>
            </div>
          )}
          
          <h5 className="section-title">Summary</h5>
          <div className="card mb-4 summary-card">
            <div className="card-body">
              <p className="summary-text">
                {paragraph_summary || "No summary available."}
              </p>
            </div>
          </div>
          
          <h5 className="section-title">Key Points</h5>
          <div className="card key-points-card">
            <div className="card-body">
              {bullet_points && bullet_points.length > 0 ? (
                <ul className="key-points-list">
                  {bullet_points.map((point, index) => (
                    <li key={index} className="key-point-item">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No key points available.</p>
              )}
            </div>
          </div>
          
          {completed_at && (
            <div className="text-muted mt-3 completion-time">
              <small>Completed at: {formatDate(completed_at)}</small>
            </div>
          )}
          
          <div className="text-center mt-4">
            <button 
              onClick={onReset} 
              className="btn btn-primary new-summary-btn"
            >
              Summarize Another Podcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;