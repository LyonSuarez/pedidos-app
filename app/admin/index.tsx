import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AdminIndex() {
  useEffect(() => {
    router.replace('/admin/menu');
  }, []);

  return null;
}

