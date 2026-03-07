import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // 这个页面不应该被访问，立即重定向
    // 让路由守卫决定去哪里
    router.replace('/splash');
  }, [router]);

  return null;
}
