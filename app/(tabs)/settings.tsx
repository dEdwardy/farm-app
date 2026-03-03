import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authService } from '@/services/authService';

const UINFO_KEY = 'user_info';


export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
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
          username:userData.email
        });
      } else {
        // 如果本地存储中没有用户信息，使用默认值
        setUser({ username: '用户' });
      }
    } catch (e) {
      console.error('Fetch user info error:', e);
      // 出错时使用默认值
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
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
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
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
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
            style={[styles.logoutButton, { borderWidth: 1, borderColor: '#1976d2', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#1976d2', fontWeight: '600', fontSize: 16 }}>退出登录</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 24,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    marginBottom: 24,
    // 轻微阴影，兼容 iOS/Android
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
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
    backgroundColor: '#e5f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#007aff',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionCard: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    // 轻微阴影，兼容 iOS/Android
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logoutButton: {
    width: '100%',
  } as any,
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
});
