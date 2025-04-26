/**
 * API service for Ekhtaser application
 * This file contains functions to interact with the Flask backend API
 */

// Base API URL - adjust for production
const API_URL = '/api';

/**
 * Submit a YouTube URL for processing
 * 
 * @param {string} url - YouTube URL to process
 * @returns {Promise<Object>} - Response data with job_id
 */
export const submitUrl = async (url) => {
  try {
    const response = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.trim() }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API submitUrl error:', error);
    throw error;
  }
};

/**
 * Check the status of a processing job
 * 
 * @param {string} jobId - Job ID to check
 * @returns {Promise<Object>} - Job status and data
 */
export const checkJobStatus = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/job/${jobId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API checkJobStatus error:', error);
    throw error;
  }
};

/**
 * Get a list of recent summaries
 * 
 * @param {number} limit - Maximum number of summaries to return
 * @returns {Promise<Array>} - List of recent summaries
 */
export const getRecentSummaries = async (limit = 5) => {
  try {
    const response = await fetch(`${API_URL}/recent?limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API getRecentSummaries error:', error);
    throw error;
  }
};

/**
 * Validate a YouTube URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is a valid YouTube URL
 */
export const isValidYoutubeUrl = (url) => {
  if (!url) return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
  return youtubeRegex.test(url.trim());
};

export default {
  submitUrl,
  checkJobStatus,
  getRecentSummaries,
  isValidYoutubeUrl
};