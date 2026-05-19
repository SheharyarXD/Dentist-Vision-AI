from flask import Flask, render_template, request, jsonify, send_from_directory
import os, json, uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ANNOTATIONS_FOLDER'] = 'annotations'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_images():
    images = []
    for f in sorted(os.listdir(app.config['UPLOAD_FOLDER'])):
        if allowed_file(f):
            ann_file = os.path.join(app.config['ANNOTATIONS_FOLDER'], f + '.json')
            annotated = os.path.exists(ann_file)
            images.append({'filename': f, 'annotated': annotated})
    return images

@app.route('/')
def index():
    images = get_images()
    return render_template('index.html', images=images)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/images')
def api_images():
    return jsonify(get_images())

@app.route('/api/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files'}), 400
    files = request.files.getlist('files')
    uploaded = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            uploaded.append(filename)
    return jsonify({'uploaded': uploaded})

@app.route('/api/annotations/<filename>', methods=['GET'])
def get_annotation(filename):
    ann_file = os.path.join(app.config['ANNOTATIONS_FOLDER'], filename + '.json')
    if os.path.exists(ann_file):
        with open(ann_file) as f:
            return jsonify(json.load(f))
    return jsonify({'filename': filename, 'annotations': [], 'label': '', 'notes': ''})

@app.route('/api/annotations/<filename>', methods=['POST'])
def save_annotation(filename):
    data = request.json
    data['filename'] = filename
    ann_file = os.path.join(app.config['ANNOTATIONS_FOLDER'], filename + '.json')
    with open(ann_file, 'w') as f:
        json.dump(data, f, indent=2)
    return jsonify({'status': 'saved'})

@app.route('/api/export')
def export_all():
    all_annotations = []
    for f in os.listdir(app.config['ANNOTATIONS_FOLDER']):
        if f.endswith('.json'):
            with open(os.path.join(app.config['ANNOTATIONS_FOLDER'], f)) as fp:
                all_annotations.append(json.load(fp))
    return jsonify(all_annotations)

@app.route('/api/stats')
def stats():
    images = get_images()
    total = len(images)
    annotated = sum(1 for i in images if i['annotated'])
    return jsonify({'total': total, 'annotated': annotated, 'remaining': total - annotated})

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['ANNOTATIONS_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)
