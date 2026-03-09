// 常量定义文件

// 业务常量
export const BUSINESS_CONSTANTS = {
  // 文件上传相关
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/*'
  ],
  
  // 图片压缩配置
  IMAGE_COMPRESSION: {
    QUALITY: 0.8,
    MAX_WIDTH: 1080,
    MAX_HEIGHT: 1080
  },
  
  // 表单相关
  FORM_DEBOUNCE_DELAY: 300,
  
  // 导航相关
  NAVIGATION_DELAY: 1000,
  
  // 分页相关
  PAGINATION: {
    PAGE_SIZE: 20
  }
};

// API 相关常量
export const API_CONSTANTS = {
  ENDPOINTS: {
    FARMS: '/farms',
    UPLOAD: '/upload'
  },
  TIMEOUT: 30000, // 30秒
  RETRY_ATTEMPTS: 3
};

// 存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
  HAS_REQUESTED_PERMISSIONS: 'hasRequestedPermissions'
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UPLOAD_FAILED: '文件上传失败，请稍后重试',
  INVALID_FILE: '无效的文件格式',
  FILE_TOO_LARGE: '文件大小超过限制',
  MAX_FILES_EXCEEDED: '文件数量超过限制',
  COMPRESSION_FAILED: '压缩图片失败，请稍后重试',
  PERMISSION_DENIED: '权限被拒绝，请在设置中开启权限',
  DATA_FETCH_FAILED: '获取数据失败，请稍后重试',
  SUBMIT_FAILED: '提交失败，请稍后重试'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '文件上传成功',
  SUBMIT_SUCCESS: '提交成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功'
};

// 表单验证规则
export const VALIDATION_RULES = {
  PHONE_REGEX: /^1[3-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NUMBER_REGEX: /^\d+(\.\d+)?$/,
  REQUIRED_MESSAGE: '此字段为必填项',
  PHONE_MESSAGE: '请输入有效的手机号码',
  NUMBER_MESSAGE: '请输入有效的数字'
};

// 路由名称
export const ROUTES = {
  SPLASH: 'splash',
  LOGIN: 'login',
  ONBOARDING: 'onboarding',
  TABS: '(tabs)',
  ADD: 'add',
  EDIT: 'edit',
  DETAIL: 'detail'
};

// 业务类型
export const BUSINESS_TYPES = {
  FARM_IMAGES: 'farm_images',
  TAIL_WATER_IMAGES: 'tail_water_images',
  SAFETY_INFO: 'safety_info'
};

// 操作状态
export const OPERATION_STATUS = {
  READY: 'ready',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// 存储类型
export const STORAGE_TYPES = {
  IMAGE: 'image',
  FILE: 'file'
};

// 预览类型
export const PREVIEW_TYPES = {
  PICTURE: 'picture',
  LIST: 'list'
};