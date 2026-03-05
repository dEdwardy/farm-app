# 渔场管家 - 品牌设计规范

## 应用名称

**渔场管家**

### 命名理念
- **渔场**：直接点明水产养殖的行业属性
- **管家**：体现专业、贴心、全面的管理服务
- 整体传达出"专业的水产养殖管理助手"的品牌形象

### 英文名称
**AquaManager** 或 **FishFarm Pro**

---

## 应用口号

**智能水产养殖管理专家**

### 备选口号
1. 智慧养殖，轻松管理
2. 让水产养殖更智能
3. 您的贴身养殖助手

---

## Logo设计

### 设计理念
Logo融合水滴💧和鱼形🐟元素，采用抽象化设计：
- **外轮廓**：水滴形状，代表水产养殖的水环境
- **内部图形**：鱼形剪影，体现养殖对象
- **整体寓意**：水滴滋养鱼儿，象征生态养殖、可持续发展

### 颜色方案
- **主色调**：生态绿 #4CAF50 → 水蓝 #2196F3 渐变
- **象征意义**：
  - 绿色：生态、环保、健康、可持续发展
  - 蓝色：水、科技、专业、信任

### Logo SVG代码

```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4CAF50" />
      <stop offset="100%" stop-color="#2196F3" />
    </linearGradient>
  </defs>
  <!-- 外轮廓 - 水滴形状 -->
  <path d="M60,20 C80,20 100,30 100,60 C100,90 80,100 60,100 C40,100 20,90 20,60 C20,30 40,20 60,20 Z" 
        fill="url(#logoGradient)" />
  <!-- 内部鱼形 -->
  <path d="M45,50 C55,40 75,40 85,50 C90,60 85,75 75,80 C65,85 50,80 45,70 C40,65 40,55 45,50 Z" 
        fill="white" opacity="0.9" />
  <!-- 鱼眼 -->
  <path d="M50,55 C55,50 65,50 70,55 C75,65 70,75 60,80 C50,75 45,65 50,55 Z" 
        fill="#E8F5E9" />
  <!-- 鱼尾 -->
  <path d="M60,65 L65,70 L55,70 Z" fill="#2E7D32" />
</svg>
```

### 不同尺寸版本

#### 应用图标 (1024×1024)
- 使用完整Logo，无文字
- 圆角处理：180px 圆角半径
- 背景：白色或透明

#### 启动图标 (192×192)
- 简化版Logo，保留核心图形
- 适合Android启动图标

#### Favicon (32×32)
- 极简版，仅保留水滴轮廓

---

## 色彩系统

### 主色调
| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 生态绿 | #4CAF50 | 主按钮、强调、成功状态 |
| 深绿色 | #2E7D32 | 标题、重要文字 |
| 浅绿色 | #81C784 | 悬停状态、辅助元素 |

### 辅助色
| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 水蓝色 | #2196F3 | 链接、信息提示 |
| 深蓝 | #1565C0 | 选中状态 |
| 浅蓝 | #64B5F6 | 背景装饰 |

### 中性色
| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 深灰 | #333333 | 主要文字 |
| 中灰 | #666666 | 次要文字 |
| 浅灰 | #999999 | 占位符、禁用状态 |
| 背景灰 | #F5F5F5 | 页面背景 |
| 白色 | #FFFFFF | 卡片背景、反白文字 |

### 功能色
| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 警告橙 | #FF9800 | 警告、提醒 |
| 错误红 | #F44336 | 错误、删除 |
| 信息蓝 | #2196F3 | 信息提示 |

---

## 字体规范

### 中文字体
- **主字体**：Noto Sans SC（思源黑体）
- **备选**：PingFang SC（苹方）、Microsoft YaHei（微软雅黑）

### 英文字体
- **主字体**：Roboto
- **备选**：SF Pro、Helvetica Neue

### 字号规范
| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| 大标题 | 28px | Bold (700) | 1.3 |
| 页面标题 | 20px | SemiBold (600) | 1.4 |
| 卡片标题 | 18px | SemiBold (600) | 1.4 |
| 正文 | 16px | Regular (400) | 1.5 |
| 辅助文字 | 14px | Regular (400) | 1.5 |
| 标签/提示 | 12px | Regular (400) | 1.4 |

---

## 图标系统

### 图标风格
- **风格**：线性图标（Outline）
- **线宽**：2px
- **圆角**：2px
- **尺寸**：24×24px（标准）、20×20px（小）、32×32px（大）

### 核心功能图标
| 功能 | 图标名称 | 图标代码 |
|------|---------|---------|
| 养殖场 | mdi:home-variant | <span class="iconify" data-icon="mdi:home-variant"></span> |
| 养殖监测 | mdi:fish | <span class="iconify" data-icon="mdi:fish"></span> |
| 尾水处理 | mdi:water-cycle | <span class="iconify" data-icon="mdi:water-cycle"></span> |
| 安全信息 | mdi:shield-check | <span class="iconify" data-icon="mdi:shield-check"></span> |
| 数据统计 | mdi:chart-line | <span class="iconify" data-icon="mdi:chart-line"></span> |
| 设置 | mdi:cog | <span class="iconify" data-icon="mdi:cog"></span> |
| 添加 | mdi:plus | <span class="iconify" data-icon="mdi:plus"></span> |
| 搜索 | mdi:magnify | <span class="iconify" data-icon="mdi:magnify"></span> |
| 编辑 | mdi:pencil | <span class="iconify" data-icon="mdi:pencil"></span> |
| 删除 | mdi:delete | <span class="iconify" data-icon="mdi:delete"></span> |

### 图标库
- **推荐**：Material Design Icons (MDI)
- **备用**：Phosphor Icons、Feather Icons

---

## 应用场景

### 1. 应用启动页
- 背景：渐变绿色 #4CAF50 → #81C784
- 中央：Logo（白色版本）
- 底部：应用名称 + Slogan

### 2. 应用图标
- iOS：1024×1024px，圆角 180px
- Android：自适应图标，支持多种形状
- 主题：Logo主体 + 品牌色背景

### 3. 底部导航栏
- 首页：home-variant
- 统计：chart-line
- 设置：cog
- 选中态：品牌绿色 + 填充样式

### 4. 功能卡片
- 图标：48×48px，品牌绿色
- 标题：18px SemiBold
- 描述：14px Regular，灰色

---

## 文件输出

### 已生成文件
1. `app-branding.html` - 品牌展示页面
2. `brand-guidelines.md` - 品牌设计规范文档

### 需要设计的资源
- [ ] App Icon (iOS & Android)
- [ ] 启动页/闪屏页
- [ ] 应用商店截图模板
- [ ] 宣传海报
- [ ] 社交媒体封面

---

## 使用建议

### Do's ✓
- 保持Logo的完整性，不拉伸变形
- 使用品牌色作为强调色
- 保持足够的留白空间
- 在深色背景上使用白色版本Logo

### Don'ts ✗
- 改变Logo的颜色
- 旋转或倾斜Logo
- 添加阴影或描边效果
- 在复杂背景上使用彩色Logo

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03-04 | 初始版本，包含Logo、色彩、字体规范 |

---

*本规范由 MCP 设计助手生成，供开发团队参考使用。*
