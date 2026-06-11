import api from './api';
import { ActivityNotification } from '../types';

interface GetNotificationsResponse {
  notifications: ActivityNotification[];
  unreadCount: number;
}

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get<GetNotificationsResponse>('/notifications');
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
