import { Routes, Route, Navigate } from 'react-router';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import RadiographAnalysis from '@/pages/RadiographAnalysis';
import VisualAnalysis from '@/pages/VisualAnalysis';
import TrainingMetrics from '@/pages/TrainingMetrics';
import ModelInfo from '@/pages/ModelInfo';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis" element={<RadiographAnalysis />} />
        <Route path="/visual" element={<VisualAnalysis />} />
        <Route path="/metrics" element={<TrainingMetrics />} />
        <Route path="/model" element={<ModelInfo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
