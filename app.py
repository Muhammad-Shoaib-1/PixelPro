# app.py

from flask import Flask, render_template, request, send_file
from PIL import Image, ImageEnhance
import os
import uuid

# Initialize Flask app
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ENHANCED_FOLDER = 'static/enhanced'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ENHANCED_FOLDER'] = ENHANCED_FOLDER

# Create necessary folders if not exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENHANCED_FOLDER, exist_ok=True)

# Route: Home - Serve Frontend
@app.route('/')
def index():
    return render_template('index.html')

# Helper Function - Check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route: Enhance Uploaded Image
@app.route('/enhance', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        return 'No image part', 400

    file = request.files['image']
    
    if file.filename == '':
        return 'No selected file', 400

    if not allowed_file(file.filename):
        return 'Unsupported file type', 400

    # Save uploaded image
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(upload_path)

    try:
        # Open and apply dummy enhancement (Sharpening)
        image = Image.open(upload_path)
        enhancer = ImageEnhance.Sharpness(image)
        enhanced_image = enhancer.enhance(2.0)  # 2x Sharpen

        # Save enhanced image
        enhanced_filename = f"enhanced_{filename}"
        enhanced_path = os.path.join(app.config['ENHANCED_FOLDER'], enhanced_filename)
        enhanced_image.save(enhanced_path)

        return send_file(enhanced_path, mimetype='image/png')

    except Exception as e:
        print("Error:", e)
        return 'Image processing failed', 500

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
