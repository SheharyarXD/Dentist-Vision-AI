import { motion } from 'framer-motion';
import {
  Database, BrainCircuit, Layers, FileCode, GitBranch,
  Cpu, HardDrive, Network, Settings, BookOpen,
  CheckCircle2, ArrowRight,
} from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Tufts Dental Database',
    color: 'bg-blue-500/10 text-blue-600',
    content: [
      'The Tufts Dental Database is a comprehensive collection of dental radiographs used for research and educational purposes.',
      'It contains panoramic dental X-rays and periapical images from real clinical settings.',
      'Due to access restrictions, this project uses a high-quality synthetic dataset that replicates the visual characteristics of real dental radiographs.',
      'The synthetic dataset maintains anatomical correctness in root structure representations.',
    ],
  },
  {
    icon: Settings,
    title: 'Preprocessing Pipeline',
    color: 'bg-violet-500/10 text-violet-600',
    content: [
      'Images are resized to 224x224 pixels to match ResNet18 input requirements.',
      'Normalization uses ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).',
      'Training augmentation includes random horizontal flips, rotation (-15 to +15 degrees), color jitter, and affine transforms.',
      'Validation and test images undergo only resize and normalization (no augmentation).',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'ResNet18 Architecture',
    color: 'bg-emerald-500/10 text-emerald-600',
    content: [
      'ResNet18 is an 18-layer deep residual network with ~11.2 million parameters.',
      'The model uses skip connections (residual blocks) to enable training of deep networks without vanishing gradients.',
      'Pretrained weights from ImageNet provide strong feature extraction capabilities.',
      'The final fully connected layer is replaced with a 2-output classifier for single-rooted vs multi-rooted teeth.',
    ],
  },
  {
    icon: GitBranch,
    title: 'Root Classification Logic',
    color: 'bg-amber-500/10 text-amber-600',
    content: [
      'Single-rooted teeth (incisors, canines) have one conical root structure.',
      'Multi-rooted teeth (molars, premolars) have two or more diverging roots.',
      'The model learns to distinguish these patterns through convolutional feature extraction.',
      'Classification confidence provides a measure of prediction reliability.',
    ],
  },
  {
    icon: FileCode,
    title: 'Dataset Creation Method',
    color: 'bg-red-500/10 text-red-600',
    content: [
      'Synthetic dental images are generated using geometric primitives that simulate X-ray appearance.',
      'Each tooth image includes: crown, root(s), root canal(s), enamel cap, periodontal ligament shadow.',
      'Realistic noise (Gaussian) and blur are applied to simulate radiographic imaging artifacts.',
      '800 tooth images are generated: 400 single-rooted and 400 multi-rooted, with 70/15/15 train/val/test split.',
    ],
  },
  {
    icon: Network,
    title: 'Deployment Architecture',
    color: 'bg-cyan-500/10 text-cyan-600',
    content: [
      'FastAPI serves the trained model through REST endpoints with CORS support.',
      'The /upload endpoint handles full radiograph analysis with automatic tooth detection.',
      'The /predict endpoint classifies individual tooth images.',
      'The /metrics endpoint serves pre-computed evaluation metrics as JSON.',
    ],
  },
];

const techStack = [
  { icon: Cpu, label: 'PyTorch', desc: 'Deep learning framework' },
  { icon: HardDrive, label: 'FastAPI', desc: 'Backend API server' },
  { icon: Layers, label: 'React 19', desc: 'Frontend UI' },
  { icon: Network, label: 'Tailwind CSS', desc: 'Styling' },
  { icon: BrainCircuit, label: 'ResNet18', desc: 'CNN architecture' },
  { icon: BookOpen, label: 'Recharts', desc: 'Data visualization' },
];

const pipelineSteps = [
  { step: 1, title: 'Data Collection', desc: 'Generate synthetic dental images with controlled root structures' },
  { step: 2, title: 'Preprocessing', desc: 'Resize, normalize, and augment images for training' },
  { step: 3, title: 'Model Training', desc: 'Fine-tune ResNet18 on the dental dataset' },
  { step: 4, title: 'Evaluation', desc: 'Compute accuracy, precision, recall, F1, confusion matrix' },
  { step: 5, title: 'Deployment', desc: 'Export model and serve via FastAPI REST endpoints' },
  { step: 6, title: 'Dashboard', desc: 'React frontend for interactive visualization' },
];

export default function ModelInfo() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Model Information</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Technical documentation of the dental AI classification system
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {techStack.map((tech, i) => (
          <motion.div
            key={tech.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
          >
            <tech.icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold">{tech.label}</span>
            <span className="text-xs text-muted-foreground text-center">{tech.desc}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          System Pipeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="relative flex items-start gap-3 p-4 rounded-lg bg-muted/50 border"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{step.step}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${section.color}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold">{section.title}</h3>
            </div>
            <ul className="space-y-2.5">
              {section.content.map((item, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 + j * 0.04 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Classification Logic Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-6">Classification Decision Flow</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <div className="px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Input: Tooth X-ray</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
          <div className="px-4 py-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-center">
            <p className="text-sm font-medium text-violet-800 dark:text-violet-300">ResNet18 Feature Extraction</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
          <div className="px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">FC Layer (2 classes)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Single-Rooted</p>
            </div>
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-center">
              <p className="text-sm font-bold text-red-800 dark:text-red-300">Multi-Rooted</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
