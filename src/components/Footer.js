import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="footer-title">Ekhtaser</h5>
            <p className="footer-description">
              AI-powered podcast summarization using OpenAI's Whisper and T5 models.
            </p>
          </div>
          <div className="col-md-6">
            <div className="footer-links">
              <div className="row">
                <div className="col-6">
                  <h6 className="footer-links-title">Features</h6>
                  <ul className="footer-links-list">
                    <li>
                      <a href="#transcription">Transcription</a>
                    </li>
                    <li>
                      <a href="#summarization">Summarization</a>
                    </li>
                    <li>
                      <a href="#key-points">Key Points</a>
                    </li>
                  </ul>
                </div>
                <div className="col-6">
                  <h6 className="footer-links-title">Technology</h6>
                  <ul className="footer-links-list">
                    <li>
                      <a href="https://github.com/openai/whisper" target="_blank" rel="noopener noreferrer">
                        Whisper
                      </a>
                    </li>
                    <li>
                      <a href="https://huggingface.co/docs/transformers/model_doc/t5" target="_blank" rel="noopener noreferrer">
                        T5
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/miso-belica/sumy" target="_blank" rel="noopener noreferrer">
                        TextRank
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="row footer-bottom">
          <div className="col-md-6">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Ekhtaser. All rights reserved.
            </p>
          </div>
          <div className="col-md-6">
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;