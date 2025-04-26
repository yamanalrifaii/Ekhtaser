from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import logging
import re

logger = logging.getLogger(__name__)

# Cache the model to avoid reloading
_t5_model = None
_t5_tokenizer = None

def get_t5_model():
    """
    Get or initialize the T5 model and tokenizer
    
    Returns:
        tuple: (T5ForConditionalGeneration, T5Tokenizer)
    """
    global _t5_model, _t5_tokenizer
    
    if _t5_model is None or _t5_tokenizer is None:
        logger.info("Loading T5 model for summarization")
        
        # Load the model and tokenizer
        _t5_tokenizer = T5Tokenizer.from_pretrained("paulowoicho/t5-podcast-summarisation")
        _t5_model = T5ForConditionalGeneration.from_pretrained("paulowoicho/t5-podcast-summarisation")
        
        # Move to GPU if available
        if torch.cuda.is_available():
            _t5_model = _t5_model.to("cuda")
            logger.info("Using CUDA for T5 model")
        else:
            logger.info("Using CPU for T5 model")
    
    return _t5_model, _t5_tokenizer

def chunk_text(text, max_chunk_size=1000):
    """
    Split text into chunks to handle long transcripts
    
    Args:
        text (str): Input text
        max_chunk_size (int): Maximum chunk size
        
    Returns:
        list: List of text chunks
    """
    # Split text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # If adding this sentence exceeds the max chunk size, start a new chunk
        if len(current_chunk) + len(sentence) > max_chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            if current_chunk:
                current_chunk += " " + sentence
            else:
                current_chunk = sentence
    
    # Add the last chunk if it's not empty
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def generate_summary(transcript, max_length=250, min_length=50):
    """
    Generate a summary from transcript using T5 model
    
    Args:
        transcript (str): Input transcript text
        max_length (int): Maximum summary length
        min_length (int): Minimum summary length
        
    Returns:
        str: Generated summary
    """
    try:
        logger.info("Generating summary")
        
        # Get the model and tokenizer
        model, tokenizer = get_t5_model()
        
        # For long transcripts, chunk the text and summarize each chunk
        if len(transcript) > 1000:
            logger.info("Transcript is long, chunking into smaller pieces")
            chunks = chunk_text(transcript)
            chunk_summaries = []
            
            for i, chunk in enumerate(chunks):
                logger.info(f"Summarizing chunk {i+1}/{len(chunks)}")
                
                # Prepare input
                input_text = f"summarize: {chunk}"
                input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=1024, truncation=True)
                
                # Move to GPU if available
                if torch.cuda.is_available():
                    input_ids = input_ids.to("cuda")
                
                # Generate summary
                output = model.generate(
                    input_ids=input_ids,
                    max_length=max_length // len(chunks),
                    min_length=min_length // len(chunks),
                    length_penalty=2.0,
                    num_beams=4,
                    early_stopping=True
                )
                
                # Decode and append to chunk summaries
                chunk_summary = tokenizer.decode(output[0], skip_special_tokens=True)
                chunk_summaries.append(chunk_summary)
            
            # Combine chunk summaries
            combined_summary = " ".join(chunk_summaries)
            
            # Re-summarize the combined summaries for coherence
            input_text = f"summarize: {combined_summary}"
            input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=1024, truncation=True)
            
            # Move to GPU if available
            if torch.cuda.is_available():
                input_ids = input_ids.to("cuda")
            
            # Generate final summary
            output = model.generate(
                input_ids=input_ids,
                max_length=max_length,
                min_length=min_length,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True
            )
            
            summary = tokenizer.decode(output[0], skip_special_tokens=True)
        else:
            # For shorter transcripts, summarize directly
            input_text = f"summarize: {transcript}"
            input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=1024, truncation=True)
            
            # Move to GPU if available
            if torch.cuda.is_available():
                input_ids = input_ids.to("cuda")
            
            # Generate summary
            output = model.generate(
                input_ids=input_ids,
                max_length=max_length,
                min_length=min_length,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True
            )
            
            summary = tokenizer.decode(output[0], skip_special_tokens=True)
        
        logger.info(f"Summary generated: {len(summary)} characters")
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        raise Exception(f"Failed to generate summary: {str(e)}")