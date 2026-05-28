import api from './api';
import { AIModelConfig, DoctorProfile } from '../types';

export const settingsService = {
  getConfig: async () => {
    const response = await api.get<AIModelConfig>('/settings');
    return response.data;
  },

  updateConfig: async (config: Partial<AIModelConfig>) => {
    const response = await api.put<AIModelConfig>('/settings', config);
    return response.data;
  },

  updateProfile: async (profile: Omit<DoctorProfile, 'avatarUrl'> & { avatarUrl?: string }) => {
    const response = await api.put<DoctorProfile>('/profile/update', profile);
    return response.data;
  },

  resetDatabase: async () => {
    const response = await api.post<{ message: string }>('/database/reset');
    return response.data;
  },
};
export default settingsService;
