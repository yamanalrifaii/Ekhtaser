from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
import logging
import re

logger = logging.getLogger(__name__)

def generate_bullet_points(transcript, max_sentences=10):
    """
    Generate bullet points from transcript using TextRank algorithm
    
    Args:
        transcript (str): Input transcript text
        max_sentences (int): Maximum number of bullet points to generate
        
    Returns:
        list: List of bullet point strings
    """
    try:
        logger.info("Generating bullet points")
        
        # Clean the transcript for better processing
        clean_text = re.sub(r'\s+', ' ', transcript).strip()
        
        # Create parser
        parser = PlaintextParser.from_string(clean_text, Tokenizer("english"))
        
        # Initialize TextRank summarizer
        summarizer = TextRankSummarizer()
        
        # Extract key points
        sentences = summarizer(parser.document, max_sentences)
        
        # Convert to bullet points
        bullet_points = []
        for sentence in sentences:
            # Clean up the sentence
            point = str(sentence).strip()
            
            # Ensure bullet point is meaningful
            if len(point) > 10:
                bullet_points.append(point)
        
        logger.info(f"Generated {len(bullet_points)} bullet points")
        
        return bullet_points
        
    except Exception as e:
        logger.error(f"Error generating bullet points: {str(e)}")
        raise Exception(f"Failed to generate bullet points: {str(e)}")