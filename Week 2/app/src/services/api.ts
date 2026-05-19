/**
 * API Service - DentalVisionAI Backend Integration
 * Handles all communication with the FastAPI backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ClassificationResult {
  label: string;
  confidence: number;
  class_index: number;
  probabilities: {
    single_rooted: number;
    multi_rooted: number;
  };
}

export interface ToothDetection {
  id: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  detection_confidence: number;
  classification: ClassificationResult;
}

export interface UploadResponse {
  success: boolean;
  num_teeth_detected: number;
  teeth: ToothDetection[];
  annotated_image: string | null;
}

export interface PredictResponse {
  success: boolean;
  label: string;
  confidence: number;
  class_index: number;
  probabilities: {
    single_rooted: number;
    multi_rooted: number;
  };
}

export interface MetricsResponse {
  success: boolean;
  model_info: {
    architecture: string;
    pretrained: boolean;
    total_parameters: number;
  };
  test_results: {
    accuracy: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    confusion_matrix: number[][];
    per_class: {
      single_rooted: { precision: number; recall: number; f1: number };
      multi_rooted: { precision: number; recall: number; f1: number };
    };
  };
  training: {
    epochs_trained: number;
    best_val_accuracy: number;
    history: {
      train_loss: number[];
      train_accuracy: number[];
      val_loss: number[];
      val_accuracy: number[];
    };
  };
  class_names: string[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: string;
  version: string;
}

// API Functions
export const api = {
  /**
   * Health check
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  /**
   * Upload a radiograph for full analysis (detect + classify teeth)
   */
  async uploadRadiograph(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Classify a single tooth image
   */
  async predictTooth(file: File): Promise<PredictResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<PredictResponse>('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get model metrics
   */
  async getMetrics(): Promise<MetricsResponse> {
    const response = await apiClient.get<MetricsResponse>('/metrics');
    return response.data;
  },
};

// Mock data for development when backend is unavailable
export const mockMetrics: MetricsResponse = {
  success: true,
  model_info: {
    architecture: 'ResNet18',
    pretrained: true,
    total_parameters: 11177538,
  },
  test_results: {
    accuracy: 1.0,
    precision_macro: 1.0,
    recall_macro: 1.0,
    f1_macro: 1.0,
    confusion_matrix: [[50, 0], [0, 50]],
    per_class: {
      single_rooted: { precision: 1.0, recall: 1.0, f1: 1.0 },
      multi_rooted: { precision: 1.0, recall: 1.0, f1: 1.0 },
    },
  },
  training: {
    epochs_trained: 15,
    best_val_accuracy: 1.0,
    history: {
      train_loss: [0.142, 0.098, 0.072, 0.055, 0.043, 0.035, 0.029, 0.024, 0.021, 0.018, 0.016, 0.014, 0.013, 0.012, 0.011],
      train_accuracy: [0.952, 0.968, 0.978, 0.985, 0.990, 0.993, 0.995, 0.996, 0.997, 0.998, 0.998, 0.999, 0.999, 0.999, 1.0],
      val_loss: [0.115, 0.082, 0.061, 0.047, 0.038, 0.031, 0.026, 0.022, 0.019, 0.017, 0.015, 0.014, 0.013, 0.012, 0.011],
      val_accuracy: [0.965, 0.975, 0.983, 0.988, 0.992, 0.995, 0.996, 0.997, 0.998, 0.998, 0.999, 0.999, 0.999, 1.0, 1.0],
    },
  },
  class_names: ['single_rooted', 'multi_rooted'],
};
