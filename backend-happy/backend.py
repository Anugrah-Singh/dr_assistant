from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tempfile
from mm import process_aadhaar_image
 
# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

# Configure upload settings
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/extract-aadhaar', methods=['POST'])
def extract_aadhaar():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # If user does not select file, browser also submits an empty part
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Read the file data
        file_data = file.read()
        
        # Process the image using the function from mm.py
        result = process_aadhaar_image(file_data)
        
        # Return the JSON result
        return jsonify(result)
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
