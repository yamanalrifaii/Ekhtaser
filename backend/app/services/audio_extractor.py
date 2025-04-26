import os
import pytube
import logging

logger = logging.getLogger(__name__)

def extract_audio(url, job_id, audio_dir):
    """
    Extract audio from YouTube video using pytube
    
    Args:
        url (str): YouTube video URL
        job_id (str): Unique job identifier
        audio_dir (str): Directory to save audio files
        
    Returns:
        str: Path to the extracted audio file
    """
    try:
        logger.info(f"Extracting audio from {url}")
        
        # Create YouTube object
        yt = pytube.YouTube(url)
        
        # Get video title for logging
        title = yt.title
        logger.info(f"Processing video: {title}")
        
        # Get audio stream (highest quality)
        audio_stream = yt.streams.filter(only_audio=True).order_by('abr').desc().first()
        
        if not audio_stream:
            raise Exception("No audio stream found")
        
        # Create filename
        output_filename = f"{job_id}.mp4"
        output_path = os.path.join(audio_dir, output_filename)
        
        # Download audio
        audio_stream.download(output_path=audio_dir, filename=output_filename)
        
        logger.info(f"Audio extraction completed: {output_path}")
        
        return output_path
        
    except Exception as e:
        logger.error(f"Error extracting audio: {str(e)}")
        raise Exception(f"Failed to extract audio: {str(e)}")