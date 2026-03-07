import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authService } from '@/services/authService';
import { PermissionInfo, permissionService } from '@/services/permissionService';
import { greenTheme } from '@/styles/themes';

const UINFO_KEY = 'user_info';

// 使用主题颜色
const theme = greenTheme;

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserInfo();
      await fetchPermissions();
    };
    loadData();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      // 从本地存储中获取用户信息
      const userJson = await AsyncStorage.getItem(UINFO_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser({
          ...userData,
          username: userData.email
        });
      } else {
        // 如果本地存储中没有用户信息，使用默认值
        setUser({ username: '用户' });
      }
    } catch {
      setUser({ username: '用户' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // 清除登录凭证并跳转到登录页面
      await authService.logout();
      router.replace('/login');
    } catch {
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissionList = await permissionService.getAllPermissions();
      setPermissions(permissionList);
    } catch (error) {
      console.error('获取权限状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettings = async () => {
    await permissionService.openSettings();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>设置</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.defaultAvatarText}>
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.username}>
            {user?.username || '用户'}
          </Text>
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>
        </View>

        {/* 权限管理卡片 */}
        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>权限管理</Text>
          {permissions.map((permission, index) => (
            <View key={index} style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>{permission.name}</Text>
                <Text style={styles.permissionDescription}>{permission.description}</Text>
              </View>
              <View style={[styles.permissionStatus, { backgroundColor: permission.status === 'granted' ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
                <Text style={[styles.permissionStatusText, { color: permission.status === 'granted' ? theme.colors.success : theme.colors.error }]}>
                  {permission.status === 'granted' ? '已授予' : '未授予'}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.logoutButton, styles.settingsButton]}
            onPress={handleOpenSettings}
            activeOpacity={0.7}
          >
            <Text style={[styles.logoutButtonText, styles.settingsButtonText]}>前往系统设置</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.md,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.md,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '20', // 20% 透明度
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  username: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  actionCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.md,
  },
  logoutButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.fontSize.md,
  },
  errorContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + '15', // 15% 透明度
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  permissionInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  permissionName: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  permissionStatus: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  permissionStatusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  settingsButton: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  settingsButtonText: {
    color: 'white',
  }
});
