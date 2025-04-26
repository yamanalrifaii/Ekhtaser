from flask import Flask
from .config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Create necessary directories
    os.makedirs(app.config['JOBS_DIR'], exist_ok=True)
    os.makedirs(app.config['AUDIO_DIR'], exist_ok=True)
    
    # Register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)
    
    return app