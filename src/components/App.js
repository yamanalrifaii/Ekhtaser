import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UrlForm from './UrlForm';
import ProcessingStatus from './ProcessingStatus';
import SummaryDisplay from './SummaryDisplay';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('form');
  const [jobId, setJobId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState(null);

  // Handle URL submission
  const handleSubmit = (submittedJobId) => {
    setJobId(submittedJobId);
    setCurrentView('processing');
  };

  // Handle processing completion
  const handleProcessingComplete = (data) => {
    setSummaryData(data);
    setCurrentView('results');
  };

  // Handle processing error
  const handleProcessingError = (errorMsg) => {
    setError(errorMsg);
    setCurrentView('form');
  };

  // Reset to start a new summary
  const handleReset = () => {
    setJobId(null);
    setSummaryData(null);
    setError(null);
    setCurrentView('form');
  };

  // Main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case 'form':
        return (
          <div className="container mt-5">
            <UrlForm onSubmit={handleSubmit} />
            {error && (
              <div className="alert alert-danger mt-4">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        );
      case 'processing':
        return (
          <div className="container mt-5">
            <ProcessingStatus 
              jobId={jobId} 
              onComplete={handleProcessingComplete} 
              onError={handleProcessingError} 
            />
          </div>
        );
      case 'results':
        return (
          <div className="container mt-5">
            <SummaryDisplay 
              summaryData={summaryData} 
              onReset={handleReset} 
            />
          </div>
        );
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={renderMainContent()} />
            <Route path="/about" element={
              <div className="container mt-5">
                <div className="card shadow">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">About Ekhtaser</h4>
                  </div>
                  <div className="card-body">
                    <h5>What is Ekhtaser?</h5>
                    <p>
                      Ekhtaser is an AI-powered podcast summarizer that extracts key information from YouTube podcasts. 
                      It uses advanced AI models to transcribe audio and generate concise summaries and bullet points,
                      saving you time and helping you get the essential content quickly.
                    </p>
                    <h5>How It Works</h5>
                    <ol>
                      <li><strong>Audio Extraction:</strong> We extract the audio from YouTube videos using pytube.</li>
                      <li><strong>Transcription:</strong> OpenAI's Whisper model converts speech to text with high accuracy.</li>
                      <li><strong>Summarization:</strong> A specialized T5 model generates a coherent paragraph summary.</li>
                      <li><strong>Key Points:</strong> TextRank algorithm identifies and extracts important bullet points.</li>
                    </ol>
                    <h5>Technologies Used</h5>
                    <ul>
                      <li>OpenAI's Whisper for speech-to-text</li>
                      <li>T5 model fine-tuned for podcast summarization</li>
                      <li>TextRank algorithm for extractive summarization</li>
                      <li>Flask and React for the web application</li>
                    </ul>
                  </div>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;