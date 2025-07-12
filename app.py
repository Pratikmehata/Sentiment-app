from flask import Flask, render_template, request, jsonify, send_from_directory
import joblib
import numpy as np
import nltk
import os
import sys
import sklearn
import logging
from typing import Tuple, Dict, Any
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ======================
# Environment Configuration
# ======================
def configure_environment() -> None:
    """Set up environment paths and verify dependencies"""
    logger.info("\n=== Environment Configuration ===")
    logger.info(f"Python: {sys.version.split()[0]}")
    logger.info(f"Flask: {Flask.__version__}")
    logger.info(f"scikit-learn: {sklearn.__version__}")
    logger.info(f"NLTK: {nltk.__version__}")

    # Configure NLTK
    nltk_data_path = os.path.join(os.path.expanduser('~'), 'nltk_data')
    os.makedirs(nltk_data_path, exist_ok=True)
    nltk.data.path.append(nltk_data_path)
    
    # Download required NLTK data
    required_nltk = ['stopwords', 'wordnet', 'punkt']
    for package in required_nltk:
        try:
            nltk.data.find(f'corpora/{package}')
            logger.info(f"NLTK {package} already installed")
        except LookupError:
            logger.info(f"Downloading NLTK {package}...")
            nltk.download(package, download_dir=nltk_data_path)

# ======================
# Model Loading with Validation
# ======================
def load_models() -> Tuple[Any, Any]:
    """Load and validate ML models"""
    model_path = 'model/naive_bayes.pkl'
    vectorizer_path = 'model/tfidf.pkl'
    
    try:
        # Verify files exist
        if not all(os.path.exists(p) for p in [model_path, vectorizer_path]):
            raise FileNotFoundError("Model files missing")
        
        # Load with version check
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        
        # Simple validation
        if not hasattr(model, 'predict') or not hasattr(vectorizer, 'transform'):
            raise ValueError("Invalid model files")
            
        logger.info("Models loaded successfully")
        return model, vectorizer
        
    except Exception as e:
        logger.error(f"Model loading failed: {str(e)}")
        logger.error("Please ensure:")
        logger.error("1. Model files exist in the 'model' directory")
        logger.error(f"2. Files were created with scikit-learn {sklearn.__version__}")
        logger.error("3. Files aren't corrupted")
        raise

# ======================
# API Endpoints
# ======================
@app.route('/')
def home() -> str:
    """Serve the main interface"""
    return render_template('index.html')

@app.route('/health')
def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'versions': {
            'python': sys.version.split()[0],
            'scikit-learn': sklearn.__version__,
            'flask': Flask.__version__
        }
    }

@app.route('/predict', methods=['POST'])
def predict() -> Tuple[Dict[str, Any], int]:
    """Handle sentiment prediction requests"""
    try:
        # Input validation
        text = request.form.get('text', '').strip()
        if not text or len(text) < 10:
            return {'error': 'Text must be at least 10 characters'}, 400
            
        # Transform and predict
        text_processed = tfidf.transform([text])
        prediction = model.predict(text_processed)[0]
        probabilities = model.predict_proba(text_processed)[0]
        
        return {
            'sentiment': "Positive" if prediction == 1 else "Negative",
            'confidence': float(max(probabilities)),
            'probabilities': {
                'positive': float(probabilities[1]),
                'negative': float(probabilities[0])
            },
            'model_version': '1.0',
            'timestamp': datetime.utcnow().isoformat()
        }, 200
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return {'error': 'Internal server error'}, 500

# ======================
# Static Files and Error Handlers
# ======================
@app.route('/static/<path:filename>')
def static_files(filename: str) -> Any:
    """Serve static files with cache control"""
    return send_from_directory('static', filename, max_age=31536000)

@app.errorhandler(404)
def not_found(e) -> Tuple[Dict[str, Any], int]:
    return {'error': 'Resource not found'}, 404

# ======================
# Application Startup
# ======================
if __name__ == '__main__':
    try:
        # Initial setup
        configure_environment()
        model, tfidf = load_models()
        
        # Start server
        port = int(os.environ.get('PORT', 10000))
        logger.info(f"Starting server on port {port}...")
        app.run(host='0.0.0.0', port=port)
        
    except Exception as e:
        logger.critical(f"Failed to start application: {str(e)}")
        sys.exit(1)
