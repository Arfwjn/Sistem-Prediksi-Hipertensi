import api from './api';
import { Patient } from '../types';

export const patientService = {
  getAll: async () => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  create: async (data: Omit<Patient, 'id' | 'lastChecked' | 'bpHistory'>) => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Patient>) => {
    // Map camelCase status update fields to API if necessary, but API resources handle format
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/patients/${id}`);
    return response.data;
  },
};
export default patientService;
