import { create } from 'zustand';
import { PredictionRecord } from '../types';
import { initialRecords } from '../constants/mockData';
import { usePatientStore } from './patientStore';
import { predictionService, ClassifyPayload } from '../services/predictionService';

interface PredictionState {
  records: PredictionRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (payload: ClassifyPayload) => Promise<PredictionRecord>;
  deleteRecord: (id: string) => Promise<void>;
  resetRecords: () => void;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  records: initialRecords,
  isLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await predictionService.getAll();
      set({ records: data, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal mengambil data riwayat prediksi.' });
    }
  },

  addRecord: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const savedRecord = await predictionService.classify(payload);
      
      // Update local records
      set((state) => ({
        records: [savedRecord, ...state.records],
        isLoading: false,
      }));

      // Dynamically trigger patient store to load live updated patient status and BP histories!
      usePatientStore.getState().fetchPatients();

      return savedRecord;
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal memproses data klasifikasi AI.' });
      throw e;
    }
  },

  deleteRecord: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await predictionService.delete(id);
      set((state) => ({
        records: state.records.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal menghapus catatan prediksi.' });
      throw e;
    }
  },

  resetRecords: () =>
    set(() => ({
      records: initialRecords,
      error: null,
    })),
}));
