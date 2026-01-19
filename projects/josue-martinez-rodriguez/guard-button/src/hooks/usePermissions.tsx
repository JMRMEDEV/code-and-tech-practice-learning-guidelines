import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import type { PermissionStatus } from '@/types';

export const usePermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');

  const requestPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    } catch (error) {
      console.error('Permission request failed:', error);
      setPermissionStatus('denied');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    hasPermission: permissionStatus === 'granted',
    permissionStatus,
    requestPermission,
  };
};
