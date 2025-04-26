import os
from pathlib import Path

class Config:
    # Base directory
    BASE_DIR = Path(__file__).resolve().parent.parent
    
    # Secret key for session management
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    # Data storage directories
    INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
    JOBS_DIR = os.path.join(INSTANCE_DIR, 'jobs')
    AUDIO_DIR = os.path.join(INSTANCE_DIR, 'audio')
    
    # Model configurations
    WHISPER_MODEL_SIZE = os.environ.get('WHISPER_MODEL_SIZE') or 'base'  # Options: tiny, base, small, medium, large
    USE_GPU = os.environ.get('USE_GPU', 'True').lower() in ('true', '1', 't')
    
    # Maximum content length for file uploads (10 MB)
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    
    # Job retention period in seconds (24 hours)
    JOB_RETENTION_PERIOD = 24 * 60 * 60