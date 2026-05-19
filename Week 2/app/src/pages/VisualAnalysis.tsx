import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Loader2, ImagePlus } from 'lucide-react';
import { api } from '@/services/api';
import type { UploadResponse, ToothDetection } from '@/services/api';
import { useToast } from '@/hooks/useToast';

type ViewMode = 'original' | 'annotated' | 'gallery' | 'comparison';

export default function VisualAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [selectedTooth, setSelectedTooth] = useState<ToothDetection | null>(null);
  const { addToast } = useToast();

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setViewMode('original');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await api.uploadRadiograph(file);
      setResult(data);
      if (data.teeth.length > 0) setSelectedTooth(data.teeth[0]);
      addToast(`Analyzed ${data.num_teeth_detected} teeth`, 'success');
    } catch {
      addToast('Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'original', label: 'Original' },
    { mode: 'annotated', label: 'With Boxes' },
    { mode: 'gallery', label: 'Gallery' },
    { mode: 'comparison', label: 'Comparison' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Visual Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Multi-view analysis of dental radiographs with bounding box overlays
        </p>
      </motion.div>

      {/* Upload */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:border-muted-foreground/30 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
            id="visual-upload"
          />
          <label htmlFor="visual-upload" className="cursor-pointer space-y-3 block">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <ImagePlus className="w-7 h-7 text-primary" />
            </div>
            <p className="text-base font-medium">Click to upload a radiograph</p>
            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
          </label>
        </motion.div>
      )}

      {/* Preview & Analyze */}
      <AnimatePresence>
        {previewUrl && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-xl overflow-hidden border bg-card shadow-sm max-w-2xl mx-auto">
              <img src={previewUrl} alt="Preview" className="w-full object-contain" />
              <button onClick={() => { setFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Eye className="w-5 h-5" /> Analyze</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results with View Modes */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* View Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
              {viewButtons.map((btn) => (
                <button
                  key={btn.mode}
                  onClick={() => setViewMode(btn.mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === btn.mode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* View Content */}
            <AnimatePresence mode="wait">
              {viewMode === 'original' && previewUrl && (
                <motion.div key="original" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b bg-muted/50">
                    <h3 className="text-sm font-semibold">Original Image</h3>
                  </div>
                  <div className="p-4"><img src={previewUrl} alt="Original" className="w-full max-h-96 object-contain rounded-lg" /></div>
                </motion.div>
              )}

              {viewMode === 'annotated' && result.annotated_image && (
                <motion.div key="annotated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Bounding Box Overlay</h3>
                    <span className="text-xs text-muted-foreground">{result.num_teeth_detected} teeth detected</span>
                  </div>
                  <div className="p-4"><img src={result.annotated_image} alt="Annotated" className="w-full max-h-96 object-contain rounded-lg" /></div>
                </motion.div>
              )}

              {viewMode === 'gallery' && (
                <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {result.teeth.map((tooth, i) => (
                    <motion.button
                      key={tooth.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedTooth(tooth)}
                      className={`p-4 rounded-xl border bg-card text-left hover:shadow-md transition-all ${selectedTooth?.id === tooth.id ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full mb-3 ${tooth.classification.label === 'single_rooted' ? 'bg-emerald-100' : 'bg-red-100'} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${tooth.classification.label === 'single_rooted' ? 'text-emerald-700' : 'text-red-700'}`}>
                          {tooth.id + 1}
                        </span>
                      </div>
                      <p className="text-sm font-semibold capitalize">{tooth.classification.label.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{(tooth.classification.confidence * 100).toFixed(1)}% confidence</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {viewMode === 'comparison' && selectedTooth && (
                <motion.div key="comparison" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4">Prediction Details - Tooth #{selectedTooth.id + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Predicted Label</p>
                        <p className={`text-xl font-bold capitalize ${selectedTooth.classification.label === 'single_rooted' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {selectedTooth.classification.label.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                        <p className="text-2xl font-bold">{(selectedTooth.classification.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(selectedTooth.classification.probabilities).map(([label, prob]) => (
                          <div key={label}>
                            <div className="flex justify-between text-sm">
                              <span className="capitalize text-muted-foreground">{label.replace('_', ' ')}</span>
                              <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 0.6 }}
                                className={`h-full rounded-full ${label === 'single_rooted' ? 'bg-emerald-500' : 'bg-red-500'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Detection Info</p>
                      {[
                        { label: 'Bounding Box', value: `(${selectedTooth.bbox.x1}, ${selectedTooth.bbox.y1}) to (${selectedTooth.bbox.x2}, ${selectedTooth.bbox.y2})` },
                        { label: 'Detection Confidence', value: `${(selectedTooth.detection_confidence * 100).toFixed(1)}%` },
                        { label: 'Width', value: `${selectedTooth.bbox.x2 - selectedTooth.bbox.x1}px` },
                        { label: 'Height', value: `${selectedTooth.bbox.y2 - selectedTooth.bbox.y1}px` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooth selector for comparison view */}
            {viewMode === 'comparison' && (
              <div className="flex gap-2 flex-wrap">
                {result.teeth.map((tooth) => (
                  <button
                    key={tooth.id}
                    onClick={() => setSelectedTooth(tooth)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTooth?.id === tooth.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Tooth {tooth.id + 1}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
