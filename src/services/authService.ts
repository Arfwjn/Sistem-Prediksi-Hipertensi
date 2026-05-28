import api from './api';
import { DoctorProfile } from '../types';

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<{ token: string; doctor: DoctorProfile }>('/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<DoctorProfile>('/profile');
    return response.data;
  },

  logout: async () => {
    const response = await api.post<{ message: string }>('/logout');
    return response.data;
  },
};
export default authService;
