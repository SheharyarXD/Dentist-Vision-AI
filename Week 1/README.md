# MedAnnotate – Week 1 Deliverable
### CV Project: Patient Monitoring System Using Cameras

---

## 📁 Project Structure

```
annotator/
├── app.py               # Flask backend
├── requirements.txt     # Python dependencies
├── templates/
│   └── index.html       # Annotator UI (single-page)
├── uploads/             # Place your dataset images here
└── annotations/         # Auto-generated JSON annotation files
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the app
python app.py

# 3. Open in browser
http://localhost:5000
```

---

## 🗂️ Selected Dataset

**Dataset: Chest X-Ray Images (Pneumonia)**
- **Source:** Scientific Data / Kaggle (Guangzhou Women and Children's Medical Center)
- **Citation:** Kermany, D.S. et al. (2018). *Large Dataset of Labeled Optical Coherence Tomography (OCT) and Chest X-Ray Images*. **Data in Brief**, 21, 1004–1006. [https://doi.org/10.17632/rscbjbr9sj.3](https://doi.org/10.17632/rscbjbr9sj.3)
- **Format:** JPEG X-ray images (anterior-posterior view)
- **Classes:** NORMAL / PNEUMONIA (bacterial, viral)
- **Size:** ~5,856 labeled images
- **Why chosen:** Well-documented medical imaging dataset published in *Data in Brief* journal, directly satisfying the course requirement. Supports classification, bounding box detection (lung region, consolidation), and segmentation tasks needed across all 4 weeks.

**Download Link:** https://data.mendeley.com/datasets/rscbjbr9sj/3

---

## 🛠️ Annotator Features

| Feature | Description |
|---|---|
| **Bounding Box** | Click-drag to draw rectangles around regions of interest |
| **Polygon** | Click to add points, double-click to close shape |
| **Point** | Single click to mark key anatomical landmarks |
| **Classification Label** | Assign image-level label (Normal, Tumor, Fracture, etc.) |
| **Custom Labels** | Add your own labels on the fly |
| **Drawing Labels** | Per-shape labels (ROI, Tumor, Lesion, Normal) |
| **Notes** | Clinical observations per image |
| **Zoom/Pan** | Mouse wheel zoom, right-click drag to pan |
| **Undo/Clear** | Remove last annotation or clear all |
| **Save** | Saves annotation JSON per image |
| **Export** | Downloads all annotations as a single JSON file |
| **Progress Tracking** | Header shows total / done / remaining counts |

---

## 📤 Annotation JSON Format

Each image produces one `.json` file in `/annotations/`:

```json
{
  "filename": "image001.jpg",
  "label": "Pneumonia",
  "notes": "Bilateral consolidation visible in lower lobes",
  "annotations": [
    {
      "type": "bbox",
      "x1": 120.5, "y1": 80.2, "x2": 310.8, "y2": 250.4,
      "label": "Lesion"
    },
    {
      "type": "polygon",
      "points": [{"x": 100, "y": 90}, {"x": 200, "y": 85}, {"x": 210, "y": 180}],
      "label": "ROI"
    },
    {
      "type": "point",
      "x": 155.0, "y": 130.0,
      "label": "Tumor"
    }
  ]
}
```

Export all annotations via the **EXPORT JSON** button or `GET /api/export`.

---

## ✅ Week 1 Checklist

- [x] Dataset selected (published in Data in Brief journal)
- [x] Custom Flask annotator built from scratch
- [x] Bounding box annotation support
- [x] Polygon annotation support
- [x] Point annotation support
- [x] Classification labeling
- [x] JSON export for downstream ML pipeline
- [ ] Annotate 20 sample images (do this manually using the tool)

---

## 📅 Week-by-Week Plan

| Week | Task |
|---|---|
| Week 1 | Dataset + annotator ✅ |
| Week 2 | Use annotations → train ResNet/EfficientNet classifier |
| Week 3 | Train YOLOv8 on annotated bounding boxes |
| Week 4 | Train U-Net for lung segmentation + write paper |
