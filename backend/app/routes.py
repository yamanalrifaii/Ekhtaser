from flask import Blueprint, jsonify, request, render_template, current_app
import os
import uuid
import threading
import json
from urllib.parse import urlparse
import re
from datetime import datetime

# Import services
from .services.audio_extractor import extract_audio
from .services.transcriber import transcribe_audio
from .services.summarizer import generate_summary
from .services.bullet_maker import generate_bullet_points

main_bp = Blueprint('main', __name__)

def is_valid_youtube_url(url):
    """Validate if URL is a valid YouTube URL"""
    youtube_regex = (
        r'(https?://)?(www\.)?'
        r'(youtube|youtu|youtube-nocookie)\.(com|be)/'
        r'(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})')
    
    youtube_regex_match = re.match(youtube_regex, url)
    return bool(youtube_regex_match)

def save_job(job_id, data):
    """Save job data to file"""
    job_file = os.path.join(current_app.config['JOBS_DIR'], f"{job_id}.json")
    with open(job_file, 'w') as f:
        json.dump(data, f)

def load_job(job_id):
    """Load job data from file"""
    job_file = os.path.join(current_app.config['JOBS_DIR'], f"{job_id}.json")
    if os.path.exists(job_file):
        with open(job_file, 'r') as f:
            return json.load(f)
    return None

def process_video(job_id, url):
    """Process video in background"""
    try:
        # Update job status
        job_data = {
            'status': 'extracting_audio',
            'created_at': datetime.now().isoformat(),
            'url': url
        }
        save_job(job_id, job_data)
        
        # Extract audio
        audio_path = extract_audio(url, job_id, current_app.config['AUDIO_DIR'])
        
        # Update job status
        job_data['status'] = 'transcribing'
        job_data['audio_path'] = audio_path
        save_job(job_id, job_data)
        
        # Transcribe audio
        transcript = transcribe_audio(audio_path, current_app.config['WHISPER_MODEL_SIZE'], current_app.config['USE_GPU'])
        
        # Update job status
        job_data['status'] = 'summarizing'
        job_data['transcript'] = transcript
        save_job(job_id, job_data)
        
        # Generate summary
        paragraph_summary = generate_summary(transcript)
        
        # Generate bullet points
        bullet_points = generate_bullet_points(transcript)
        
        # Update job status
        job_data['status'] = 'completed'
        job_data['paragraph_summary'] = paragraph_summary
        job_data['bullet_points'] = bullet_points
        job_data['completed_at'] = datetime.now().isoformat()
        save_job(job_id, job_data)
        
    except Exception as e:
        # Update job status with error
        job_data = load_job(job_id)
        if job_data:
            job_data['status'] = 'error'
            job_data['error'] = str(e)
            save_job(job_id, job_data)

@main_bp.route('/')
def index():
    """Render the frontend page"""
    return render_template('index.html')

@main_bp.route('/api/summarize', methods=['POST'])
def summarize():
    """API endpoint to process a YouTube video"""
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url']
    
    if not is_valid_youtube_url(url):
        return jsonify({'error': 'Invalid YouTube URL'}), 400
    
    # Create a unique job ID
    job_id = str(uuid.uuid4())
    
    # Initialize job data
    job_data = {
        'status': 'queued',
        'created_at': datetime.now().isoformat(),
        'url': url
    }
    save_job(job_id, job_data)
    
    # Start processing in background
    thread = threading.Thread(target=process_video, args=(job_id, url))
    thread.daemon = True
    thread.start()
    
    return jsonify({'job_id': job_id, 'status': 'queued'})

@main_bp.route('/api/job/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """API endpoint to check job status"""
    job_data = load_job(job_id)
    
    if not job_data:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(job_data)