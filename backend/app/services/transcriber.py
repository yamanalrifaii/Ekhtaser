import whisper
import torch
import logging
import os

logger = logging.getLogger(__name__)

# Cache the model to avoid reloading
_whisper_model = None

def get_whisper_model(model_size, use_gpu):
    """
    Get or initialize the Whisper model
    
    Args:
        model_size (str): Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        use_gpu (bool): Whether to use GPU acceleration if available
        
    Returns:
        whisper.Model: Initialized Whisper model
    """
    global _whisper_model
    
    if _whisper_model is None:
        logger.info(f"Loading Whisper model: {model_size}")
        
        # Set device
        device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        if device == "cuda":
            logger.info("Using CUDA for Whisper model")
        else:
            logger.info("Using CPU for Whisper model")
        
        # Load model
        _whisper_model = whisper.load_model(model_size, device=device)
        
    return _whisper_model

def transcribe_audio(audio_path, model_size='base', use_gpu=True):
    """
    Transcribe audio file using OpenAI's Whisper
    
    Args:
        audio_path (str): Path to audio file
        model_size (str): Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        use_gpu (bool): Whether to use GPU acceleration if available
        
    Returns:
        str: Transcribed text
    """
    try:
        logger.info(f"Transcribing audio: {audio_path}")
        
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        # Get the model
        model = get_whisper_model(model_size, use_gpu)
        
        # Transcribe audio
        result = model.transcribe(audio_path)
        
        # Get transcribed text
        transcript = result["text"]
        
        logger.info(f"Transcription completed: {len(transcript)} characters")
        
        return transcript
        
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        raise Exception(f"Failed to transcribe audio: {str(e)}")