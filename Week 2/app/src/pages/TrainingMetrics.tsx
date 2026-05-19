import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { TrendingUp, Activity, BarChart2, Target } from 'lucide-react';
import { api, mockMetrics } from '@/services/api';
import type { MetricsResponse } from '@/services/api';

export default function TrainingMetrics() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getMetrics();
        setMetrics(data);
      } catch {
        setMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading || !metrics) {
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

  const history = metrics.training.history;

  // Prepare chart data
  const lossData = history.train_loss.map((loss, i) => ({
    epoch: i + 1,
    'Train Loss': Number(loss.toFixed(4)),
    'Val Loss': Number(history.val_loss[i]?.toFixed(4) || 0),
  }));

  const accuracyData = history.train_accuracy.map((acc, i) => ({
    epoch: i + 1,
    'Train Accuracy': Number((acc * 100).toFixed(2)),
    'Val Accuracy': Number(((history.val_accuracy[i] || 0) * 100).toFixed(2)),
  }));

  // Confusion matrix data
  const cm = metrics.test_results.confusion_matrix;
  const classNames = metrics.class_names;

  const cmMax = Math.max(...cm.flat());

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Training Metrics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Detailed training history, performance curves, and evaluation results
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Test Accuracy', value: `${(metrics.test_results.accuracy * 100).toFixed(1)}%`, icon: Target, color: 'text-emerald-500' },
          { label: 'Precision', value: `${(metrics.test_results.precision_macro * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Recall', value: `${(metrics.test_results.recall_macro * 100).toFixed(1)}%`, icon: Activity, color: 'text-violet-500' },
          { label: 'F1 Score', value: `${(metrics.test_results.f1_macro * 100).toFixed(1)}%`, icon: BarChart2, color: 'text-amber-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Loss Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Loss Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="epoch" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="Train Loss" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="Val Loss" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Accuracy Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Accuracy Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="epoch" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 105]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Train Accuracy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Val Accuracy" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Confusion Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">Confusion Matrix</h3>
        <div className="flex items-start gap-8">
          <div>
            <div className="flex">
              <div className="w-24" />
              <div className="flex">
                {classNames.map((name) => (
                  <div key={name} className="w-24 text-center text-xs font-medium text-muted-foreground pb-2 capitalize">
                    {name.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
            {cm.map((row, i) => (
              <div key={i} className="flex">
                <div className="w-24 flex items-center pr-3 text-xs font-medium text-muted-foreground capitalize">
                  {classNames[i]?.replace('_', ' ')}
                </div>
                <div className="flex">
                  {row.map((val, j) => {
                    const intensity = cmMax > 0 ? val / cmMax : 0;
                    const isCorrect = i === j;
                    return (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + (i * 2 + j) * 0.1 }}
                        className="w-24 h-20 flex items-center justify-center text-lg font-bold border border-border/50"
                        style={{
                          backgroundColor: isCorrect
                            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.4})`
                            : `rgba(239, 68, 68, ${0.1 + intensity * 0.4})`,
                          color: isCorrect ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500/20 border border-emerald-500" />
              <span className="text-xs text-muted-foreground">Correct (TP)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/20 border border-red-500" />
              <span className="text-xs text-muted-foreground">Incorrect (FP/FN)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Per-Class Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border bg-card overflow-hidden shadow-sm"
      >
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Per-Class Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Class</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Precision</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Recall</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {classNames.map((name) => {
                const pc = metrics.test_results.per_class[name as keyof typeof metrics.test_results.per_class];
                return (
                  <tr key={name} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium capitalize">{name.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right">{(pc.precision * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-right">{(pc.recall * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-right font-semibold">{(pc.f1 * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
