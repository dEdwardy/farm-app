import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const indexStyles = StyleSheet.create({
  // 容器样式
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: 100, // 增加底部 padding，为新增按钮留出空间
  },
  // 标题栏
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 搜索容器
  searchContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  searchInputContainer: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchButton: {
    flexShrink: 0,
    paddingVertical: 0,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: theme.colors.text.white,
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
  },
  // 表格样式
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.divider,
  },
  headerRow: {
    backgroundColor: theme.colors.primary,
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    justifyContent: 'center',
  },
  serialCell: {
    width: 80,
  },
  nameCell: {
    width: 200,
  },
  addressCell: {
    width: 220,
  },
  coordCell: {
    width: 160,
  },
  phoneCell: {
    width: 140,
  },
  personCell: {
    width: 120,
  },
  dateCell: {
    width: 180,
  },
  headerCell: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  headerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.white,
    fontWeight: '500',
  },
  headerTextBold: {
    fontWeight: '600',
  },
  cellText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
  },
  nameText: {
    fontWeight: '500',
    color: theme.colors.primary,
  },
  clickableText: {
    textDecorationLine: 'underline',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    flex: 1,
  },
  phoneIcon: {
    marginLeft: theme.spacing.sm,
  },
});