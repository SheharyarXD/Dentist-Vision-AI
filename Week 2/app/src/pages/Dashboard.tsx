import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Target,
  TrendingUp,
  BrainCircuit,
  Layers,
  Zap,
  Clock,
} from 'lucide-react';
import { api, mockMetrics } from '@/services/api';
import type { MetricsResponse } from '@/services/api';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
  color: string;
}

function MetricCard({ title, value, subtitle, icon, delay, color }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 ${color} rounded-full -translate-y-8 translate-x-8`} />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  barColor: string;
  percentage: number;
  delay: number;
}

function StatItem({ label, value, barColor, percentage, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getMetrics();
        setMetrics(data);
      } catch {
        setMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const m = metrics!;
  const testResults = m.test_results;

  const metricCards = [
    {
      title: 'Dataset Size',
      value: '800',
      subtitle: 'Synthetic dental images generated',
      icon: <Database className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Model Accuracy',
      value: `${(testResults.accuracy * 100).toFixed(1)}%`,
      subtitle: 'Test set classification accuracy',
      icon: <Target className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'Precision',
      value: `${(testResults.precision_macro * 100).toFixed(1)}%`,
      subtitle: 'Macro-averaged precision score',
      icon: <TrendingUp className="w-5 h-5 text-violet-600" />,
      color: 'bg-violet-500',
    },
    {
      title: 'F1 Score',
      value: `${(testResults.f1_macro * 100).toFixed(1)}%`,
      subtitle: 'Harmonic mean of precision & recall',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-500',
    },
  ];

  const stats = [
    {
      label: 'Single-Rooted Precision',
      value: `${(testResults.per_class.single_rooted.precision * 100).toFixed(1)}%`,
      barColor: 'bg-emerald-500',
      percentage: testResults.per_class.single_rooted.precision * 100,
    },
    {
      label: 'Multi-Rooted Precision',
      value: `${(testResults.per_class.multi_rooted.precision * 100).toFixed(1)}%`,
      barColor: 'bg-red-500',
      percentage: testResults.per_class.multi_rooted.precision * 100,
    },
    {
      label: 'Single-Rooted Recall',
      value: `${(testResults.per_class.single_rooted.recall * 100).toFixed(1)}%`,
      barColor: 'bg-emerald-400',
      percentage: testResults.per_class.single_rooted.recall * 100,
    },
    {
      label: 'Multi-Rooted Recall',
      value: `${(testResults.per_class.multi_rooted.recall * 100).toFixed(1)}%`,
      barColor: 'bg-red-400',
      percentage: testResults.per_class.multi_rooted.recall * 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of the dental root classification system
        </p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <MetricCard key={card.title} {...card} delay={i * 0.1} />
        ))}
      </div>

      {/* Stats + Model Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <StatItem key={stat.label} {...stat} delay={0.5 + i * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Model Info</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Architecture', value: m.model_info.architecture },
              { label: 'Parameters', value: `${(m.model_info.total_parameters / 1e6).toFixed(2)}M` },
              { label: 'Pretrained', value: m.model_info.pretrained ? 'ImageNet' : 'No' },
              { label: 'Classes', value: m.class_names.join(', ') },
              { label: 'Epochs Trained', value: m.training.epochs_trained },
              { label: 'Best Val Acc', value: `${(m.training.best_val_accuracy * 100).toFixed(1)}%` },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Analyze Radiograph', path: '/analysis', color: 'bg-blue-500 hover:bg-blue-600' },
            { label: 'View Training Metrics', path: '/metrics', color: 'bg-violet-500 hover:bg-violet-600' },
            { label: 'Model Details', path: '/model', color: 'bg-emerald-500 hover:bg-emerald-600' },
          ].map((action) => (
            <a
              key={action.path}
              href={action.path}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${action.color}`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
