import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
      
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '85%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
              marginBottom: 12,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            {message}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: '#f5f5f5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#333',
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: destructive ? '#FF5252' : theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#fff',
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
