import { notification } from 'antd';

export const ToastMessage = (title, message, type) => {
  notification[type]({
    message: title,
    description: message,
    duration: 5.2
  });
};
