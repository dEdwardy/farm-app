import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';

import { FarmForm } from '@/components/FarmForm';
import { BUSINESS_CONSTANTS } from '@/constants';

export default function AddScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const handleSuccess = () => {
    // 1秒后返回列表页
    setTimeout(() => {
      router.replace('/');
    }, BUSINESS_CONSTANTS.NAVIGATION_DELAY);
  };

  return (
    <FarmForm 
      onSuccess={handleSuccess}
      navigation={navigation}
    />
  );
}
