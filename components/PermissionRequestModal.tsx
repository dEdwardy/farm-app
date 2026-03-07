import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { greenTheme } from '@/styles/themes';
import { permissionService } from '@/services/permissionService';

const theme = greenTheme;

interface PermissionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  permissionName: string;
  permissionDescription: string;
}

export const PermissionRequestModal: React.FC<PermissionRequestModalProps> = ({
  visible,
  onClose,
  permissionName,
  permissionDescription
}) => {
  const handleOpenSettings = async () => {
    await permissionService.openSettings();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>需要{permissionName}权限</Text>
          <Text style={styles.description}>
            {permissionDescription}，请在系统设置中开启此权限。
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.settingsButton]}
              onPress={handleOpenSettings}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsButtonText}>去设置</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: theme.colors.primary,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});
