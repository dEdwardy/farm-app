import * as ImagePicker from 'expo-image-picker';
import { Linking, Platform } from 'react-native';

// 权限类型定义
export type PermissionType = 'camera' | 'mediaLibrary' | 'storage' | 'network';

// 权限状态定义
export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

// 权限信息接口
export interface PermissionInfo {
  type: PermissionType;
  status: PermissionStatus;
  name: string;
  description: string;
}

/**
 * 权限管理服务
 * 用于处理应用权限的请求、检查和管理
 */
export const permissionService = {
  /**
   * 请求相机权限
   * @returns 权限状态
   */
  async requestCameraPermission(): Promise<PermissionStatus> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status as PermissionStatus;
  },

  /**
   * 请求媒体库权限
   * @returns 权限状态
   */
  async requestMediaLibraryPermission(): Promise<PermissionStatus> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status as PermissionStatus;
  },

  /**
   * 检查相机权限状态
   * @returns 权限状态
   */
  async checkCameraPermission(): Promise<PermissionStatus> {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status as PermissionStatus;
  },

  /**
   * 检查媒体库权限状态
   * @returns 权限状态
   */
  async checkMediaLibraryPermission(): Promise<PermissionStatus> {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status as PermissionStatus;
  },

  /**
   * 获取所有权限状态
   * @returns 权限信息数组
   */
  async getAllPermissions(): Promise<PermissionInfo[]> {
    const cameraStatus = await this.checkCameraPermission();
    const mediaLibraryStatus = await this.checkMediaLibraryPermission();

    return [
      {
        type: 'camera',
        status: cameraStatus,
        name: '相机',
        description: '用于拍摄养殖场照片'
      },
      {
        type: 'mediaLibrary',
        status: mediaLibraryStatus,
        name: '媒体库',
        description: '用于选择和保存养殖场照片'
      },
      {
        type: 'storage',
        status: this.checkStoragePermission(),
        name: '存储',
        description: '用于存储应用数据和照片'
      },
      {
        type: 'network',
        status: this.checkNetworkPermission(),
        name: '网络',
        description: '用于访问网络资源和图片'
      }
    ];
  },

  /**
   * 检查存储权限状态
   * 注意：在Android 13+中，存储权限已经被细分为媒体库权限
   * @returns 权限状态
   */
  checkStoragePermission(): PermissionStatus {
    if (Platform.OS === 'ios') {
      // iOS 14+ 使用媒体库权限代替存储权限
      return 'granted';
    } else if (Platform.OS === 'android') {
      // Android 13+ 使用媒体库权限代替存储权限
      return 'granted';
    }
    return 'granted';
  },

  /**
   * 检查网络权限状态
   * 网络权限在AndroidManifest.xml中声明，不需要运行时请求
   * @returns 权限状态
   */
  checkNetworkPermission(): PermissionStatus {
    return 'granted';
  },

  /**
   * 打开系统权限设置页面
   */
  async openSettings(): Promise<void> {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      await Linking.openSettings();
    }
  },

  /**
   * 检查并请求所有必要的权限
   * @returns 是否所有权限都已授予
   */
  async requestAllPermissions(): Promise<boolean> {
    // 请求需要运行时权限的权限
    const cameraStatus = await this.requestCameraPermission();
    const mediaLibraryStatus = await this.requestMediaLibraryPermission();
    
    // 检查不需要运行时请求的权限
    const storageStatus = this.checkStoragePermission();
    const networkStatus = this.checkNetworkPermission();

    // 所有权限都必须是granted状态
    return cameraStatus === 'granted' && 
           mediaLibraryStatus === 'granted' && 
           storageStatus === 'granted' && 
           networkStatus === 'granted';
  }
};
