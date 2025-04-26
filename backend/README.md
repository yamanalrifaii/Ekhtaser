# Ekhtaser - AI Podcast Summarizer

Ekhtaser is an AI-powered application that summarizes YouTube podcasts. It processes YouTube links, extracts the audio, transcribes it using OpenAI's Whisper, and then generates both paragraph summaries and bullet points using T5 and TextRank algorithms.

## Features

- Extract audio from YouTube videos
- Transcribe audio using OpenAI's Whisper
- Generate coherent paragraph summaries using T5 model
- Extract key points as bullet points using TextRank algorithm
- Modern web interface with real-time status updates
- Modular Flask architecture for easy maintenance and expansion

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ekhtaser.git
   cd ekhtaser
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Install FFmpeg (required for audio processing):
   - On Ubuntu/Debian: `sudo apt-get install ffmpeg`
   - On macOS with Homebrew: `brew install ffmpeg`
   - On Windows: Download from [FFmpeg website](https://ffmpeg.org/download.html) and add to PATH

5. Download NLTK data (required for TextRank):
   ```python
   python -c "import nltk; nltk.download('punkt')"
   ```

## Usage

1. Start the Flask server:
   ```
   python run.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

3. Enter a YouTube URL and click "Summarize"

## Project Structure

The application follows a modular design where each action is in its own file:

- `run.py`: Application entry point
- `app/__init__.py`: Flask application initialization
- `app/config.py`: Configuration settings
- `app/routes.py`: API endpoints
- `app/services/`: Service modules for core functionality
  - `audio_extractor.py`: YouTube audio extraction
  - `transcriber.py`: Whisper transcription
  - `summarizer.py`: T5 summarization
  - `bullet_maker.py`: TextRank bullet point generation
- `app/templates/`: HTML templates
- `app/static/`: Static assets (CSS, JS)

## Configuration

You can configure the application by setting environment variables:

- `SECRET_KEY`: Flask secret key for session management
- `WHISPER_MODEL_SIZE`: Whisper model size (tiny, base, small, medium, large)
- `USE_GPU`: Whether to use GPU for model inference (True/False)

## Deployment

For production deployment:

1. Set up a proper database for job tracking
2. Configure a production WSGI server (Gunicorn, uWSGI)
3. Set up a reverse proxy (Nginx, Apache)
4. Configure proper security headers and CORS settings

Example Gunicorn command:
```
gunicorn -w 4 -b 127.0.0.1:8000 "app:create_app()"
```

## License

[MIT License](LICENSE)

## Acknowledgments

- OpenAI's Whisper for transcription
- T5 podcast summarization model by Paulo Woicho
- TextRank algorithm for extractive summarization