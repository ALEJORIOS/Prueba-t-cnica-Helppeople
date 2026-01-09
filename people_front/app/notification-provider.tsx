'use client';
import { App } from 'antd';
import { setNotificationApi } from '@/services/notification.service';

export default function NotificationProvider({ children }) {
  const { notification } = App.useApp();
  setNotificationApi({ notification });
  return children;
}
