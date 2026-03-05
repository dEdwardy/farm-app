# AppLogo 组件使用指南

## 组件说明

已创建两个 Logo 组件，可在项目中直接使用：

### 1. AppLogo - 完整版 Logo（带背景）
带白色圆角矩形背景和阴影效果的完整 Logo。

**文件路径**: `components/AppLogo.tsx`

**适用场景**:
- 启动页
- 登录页
- 关于页面
- 需要突出品牌形象的页面

**使用示例**:
```tsx
import { AppLogo } from '@/components/AppLogo';

// 默认大小 (120px)
<AppLogo />

// 自定义大小
<AppLogo size={150} />

// 添加自定义样式
<AppLogo 
  size={200} 
  style={{ marginTop: 20 }} 
/>
```

### 2. AppLogoSimple - 简化版 Logo（无背景）
仅包含水滴和鱼形，无背景和阴影。

**文件路径**: `components/AppLogoSimple.tsx`

**适用场景**:
- 导航栏
- 标签栏图标
- 卡片内的小图标
- 需要透明背景的场景

**使用示例**:
```tsx
import { AppLogoSimple } from '@/components/AppLogoSimple';

// 默认大小 (80px)，默认颜色
<AppLogoSimple />

// 自定义大小和颜色
<AppLogoSimple 
  size={60} 
  color="#4CAF50" 
/>

// 导航栏使用
<Stack.Screen
  name="home"
  options={{
    headerTitle: () => <AppLogoSimple size={40} />
  }}
/>
```

## Props 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | number | 120 (AppLogo) / 80 (AppLogoSimple) | Logo 尺寸（宽高相同） |
| style | any | undefined | 自定义样式 |
| color | string | #4CAF50 (仅 AppLogoSimple) | 渐变起始颜色 |

## 实际应用示例

### 1. 登录页面
```tsx
import { AppLogo } from '@/components/AppLogo';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <AppLogo size={150} />
      <Text style={styles.title}>渔场管家</Text>
      <Text style={styles.slogan}>智能水产养殖管理专家</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 20,
  },
  slogan: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
```

### 2. 导航栏标题
```tsx
import { AppLogoSimple } from '@/components/AppLogoSimple';

<Stack.Screen
  name="(tabs)"
  options={{
    headerTitle: () => (
      <AppLogoSimple size={36} />
    ),
    headerStyle: {
      backgroundColor: '#4CAF50',
    },
  }}
/>
```

### 3. 设置页面
```tsx
import { AppLogo } from '@/components/AppLogo';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <AppLogo size={100} style={styles.logo} />
      <Text style={styles.appName}>渔场管家</Text>
      <Text style={styles.version}>版本 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
});
```

### 4. 卡片内的小 Logo
```tsx
import { AppLogoSimple } from '@/components/AppLogoSimple';
import { View, Text, StyleSheet } from 'react-native';

export function FeatureCard({ title, description }) {
  return (
    <View style={styles.card}>
      <AppLogoSimple size={48} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
```

## 注意事项

1. **react-native-svg 依赖**: 项目已安装 `react-native-svg`，无需额外安装
2. **性能优化**: Logo 组件已优化，可在列表中安全使用
3. **响应式**: 使用 `size` 属性控制尺寸，支持任意尺寸
4. **主题适配**: `AppLogoSimple` 支持自定义颜色，可适配深色模式

## 导入方式

```tsx
// 完整版 Logo
import { AppLogo } from '@/components/AppLogo';

// 简化版 Logo
import { AppLogoSimple } from '@/components/AppLogoSimple';
```

## 设计规范参考

完整的品牌设计规范请查看: `docs/ui/brand-guidelines.md`

- 应用名称: 渔场管家
- 主色调: #4CAF50 (生态绿)
- 辅助色: #2196F3 (水蓝)
- Logo 设计: 水滴 + 鱼形融合
