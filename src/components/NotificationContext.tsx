import {notification} from 'antd';
import React, {createContext, useContext} from 'react';
import type {NotificationInstance} from 'antd/es/notification/interface';

interface NotificationContextProps {
  api: NotificationInstance;
  contextHolder: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextProps | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  return (
    <NotificationContext.Provider value={{api, contextHolder}}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
