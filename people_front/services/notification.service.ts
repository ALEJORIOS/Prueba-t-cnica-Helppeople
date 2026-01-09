import type { NotificationInstance } from 'antd/es/notification/interface';

let api: NotificationInstance | null = null;

export const setNotificationApi = (instance: {
  notification: NotificationInstance;
}) => {
  api = instance.notification;
};

export const notify = {
  success: (msg: string, desc?: string) =>
    api?.success({ title: msg, description: desc }),
  error: (msg: string, desc?: string) =>
    api?.error({ title: msg, description: desc }),
  info: (msg: string, desc?: string) =>
    api?.info({ title: msg, description: desc }),
  warning: (msg: string, desc?: string) =>
    api?.warning({ title: msg, description: desc }),
};
