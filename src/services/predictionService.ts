import api from './api';
import { PredictionRecord } from '../types';

export interface ClassifyPayload {
  usia: number;
  gender: 'L' | 'P';
  berat: number;
  tinggi: number;
  sistolik: number;
  diastolik: number;
  patientId?: string;
  patientName?: string;
}

export const predictionService = {
  getAll: async () => {
    const response = await api.get<PredictionRecord[]>('/predictions');
    return response.data;
  },

  classify: async (payload: ClassifyPayload) => {
    const response = await api.post<PredictionRecord>('/classify', payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/predictions/${id}`);
    return response.data;
  },
};
export default predictionService;
