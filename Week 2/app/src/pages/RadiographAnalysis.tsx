import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileImage } from 'lucide-react';
import { api } from '@/services/api';
import type { UploadResponse, ToothDetection } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function RadiographAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const { addToast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG/JPG)', 'error');
      return;
    }
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    try {
      const data = await api.uploadRadiograph(uploadedFile);
      setResult(data);
      addToast(`Detected and classified ${data.num_teeth_detected} teeth`, 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Radiograph Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload a dental radiograph to detect and classify individual teeth
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${dragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border bg-card hover:border-muted-foreground/30'
            }
          `}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-lg shadow-md object-contain"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); clearAll(); }}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadedFile?.name} ({((uploadedFile?.size || 0) / 1024).toFixed(0)} KB)
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-base font-medium">
                    Drop your radiograph here, or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PNG, JPG, JPEG (max 10MB)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Button */}
      <AnimatePresence>
        {uploadedFile && !result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5" />
                  Analyze Radiograph
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary Bar */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Successfully detected and classified {result.num_teeth_detected} teeth
              </p>
            </div>

            {/* Annotated Image */}
            {result.annotated_image && (
              <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b bg-muted/50">
                  <h3 className="text-sm font-semibold">Annotated Radiograph</h3>
                </div>
                <div className="p-4 flex justify-center">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    src={result.annotated_image}
                    alt="Annotated"
                    className="max-h-80 rounded-lg object-contain shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Individual Tooth Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Individual Tooth Classifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {result.teeth.map((tooth, idx) => (
                  <ToothCard key={tooth.id} tooth={tooth} index={idx} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToothCard({ tooth, index }: { tooth: ToothDetection; index: number }) {
  const isSingle = tooth.classification.label === 'single_rooted';
  const confidence = tooth.classification.confidence;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`px-4 py-2.5 border-b ${isSingle ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20'}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Tooth #{tooth.id + 1}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSingle ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
            {isSingle ? 'Single-Rooted' : 'Multi-Rooted'}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-bold">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Single-rooted</span>
            <span>{(tooth.classification.probabilities.single_rooted * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tooth.classification.probabilities.single_rooted * 100}%` }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Multi-rooted</span>
            <span>{(tooth.classification.probabilities.multi_rooted * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tooth.classification.probabilities.multi_rooted * 100}%` }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
              className="h-full bg-red-500 rounded-full"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground pt-1 border-t">
          <p>BBox: ({tooth.bbox.x1}, {tooth.bbox.y1}) - ({tooth.bbox.x2}, {tooth.bbox.y2})</p>
        </div>
      </div>
    </motion.div>
  );
}
