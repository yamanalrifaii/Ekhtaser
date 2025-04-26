// Ekhtaser - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlInput = document.getElementById('youtube-url');
    const submitBtn = document.getElementById('submit-btn');
    const inputForm = document.getElementById('input-form');
    const processingStatus = document.getElementById('processing-status');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const summaryResults = document.getElementById('summary-results');
    const paragraphSummary = document.getElementById('paragraph-summary');
    const bulletPoints = document.getElementById('bullet-points');
    const newSummaryBtn = document.getElementById('new-summary-btn');
    
    // Job tracking
    let jobId = null;
    let statusCheckInterval = null;
    
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
    
    // Add event listeners
    submitBtn.addEventListener('click', submitUrl);
    newSummaryBtn.addEventListener('click', resetForm);
    urlInput.addEventListener('input', validateInput);
    
    // Validate YouTube URL
    function validateInput() {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
        const isValid = youtubeRegex.test(urlInput.value.trim());
        
        if (isValid) {
            urlInput.classList.remove('is-invalid');
            urlInput.classList.add('is-valid');
            submitBtn.disabled = false;
        } else {
            urlInput.classList.remove('is-valid');
            if (urlInput.value.trim() !== '') {
                urlInput.classList.add('is-invalid');
            }
            submitBtn.disabled = (urlInput.value.trim() === '');
        }
        
        return isValid;
    }
    
    // Submit URL for processing
    function submitUrl(e) {
        e.preventDefault();
        
        if (!validateInput()) {
            return;
        }
        
        // Disable input and show processing status
        submitBtn.disabled = true;
        inputForm.classList.add('d-none');
        processingStatus.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        summaryResults.classList.add('d-none');
        
        // Reset progress
        updateProgress('queued');
        
        // Send request to API
        fetch('/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: urlInput.value.trim()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store job ID and start polling for status
            jobId = data.job_id;
            startStatusCheck();
        })
        .catch(error => {
            showError('Failed to submit URL: ' + error.message);
        });
    }
    
    // Start checking job status
    function startStatusCheck() {
        // Clear any existing interval
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
        }
        
        // Check immediately then set interval
        checkJobStatus();
        statusCheckInterval = setInterval(checkJobStatus, 3000);
    }
    
    // Check job status
    function checkJobStatus() {
        if (!jobId) return;
        
        fetch(`/api/job/${jobId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch job status');
                }
                return response.json();
            })
            .then(data => {
                // Update progress based on status
                updateProgress(data.status);
                
                // Handle completed job
                if (data.status === 'completed') {
                    clearInterval(statusCheckInterval);
                    showResults(data);
                }
                
                // Handle error
                if (data.status === 'error') {
                    clearInterval(statusCheckInterval);
                    showError(data.error || 'An unknown error occurred');
                }
            })
            .catch(error => {
                clearInterval(statusCheckInterval);
                showError('Failed to check job status: ' + error.message);
            });
    }
    
    // Update progress UI
    function updateProgress(status) {
        // Update progress bar
        const progress = statusProgress[status] || 0;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        
        // Update status text
        statusText.textContent = statusMessages[status] || 'Processing...';
        
        // Add status-specific class
        statusText.className = '';
        statusText.classList.add(`status-${status}`);
    }
    
    // Show error message
    function showError(message) {
        processingStatus.classList.add('d-none');
        errorMessage.classList.remove('d-none');
        errorText.textContent = message;
        submitBtn.disabled = false;
        inputForm.classList.remove('d-none');
    }
    
    // Show results
    function showResults(data) {
        // Hide processing status
        processingStatus.classList.add('d-none');
        
        // Update summary
        paragraphSummary.textContent = data.paragraph_summary || 'No summary available.';
        
        // Update bullet points
        bulletPoints.innerHTML = '';
        if (data.bullet_points && data.bullet_points.length > 0) {
            data.bullet_points.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                bulletPoints.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No key points available.';
            bulletPoints.appendChild(li);
        }
        
        // Show results
        summaryResults.classList.remove('d-none');
        summaryResults.classList.add('fade-in');
    }
    
    // Reset form for new submission
    function resetForm() {
        // Reset input
        urlInput.value = '';
        urlInput.classList.remove('is-valid');
        
        // Reset UI states
        inputForm.classList.remove('d-none');
        processingStatus.classList.add('d-none');
        errorMessage.classList.add('d-none');
        summaryResults.classList.add('d-none');
        
        // Enable submit button
        submitBtn.disabled = true;
        
        // Clear job ID and interval
        jobId = null;
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
        }
    }
});