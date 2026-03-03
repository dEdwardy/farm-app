import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const formStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  titleContainer: {
    marginBottom: theme.spacing.xxl,
  },
  heading: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    opacity: 0.7,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadow.sm,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  errorContainer: {
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
  },
  successContainer: {
    marginBottom: theme.spacing.md,
  },
  successText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
  },
  submitButton: {
    flex: 1,
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flex: 1,
    marginLeft: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: '80%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
  },
  successOverlay: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  errorOverlay: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  overlayText: {
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  subSection: {
    marginTop: theme.spacing.lg,
    marginLeft: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  subSectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
});
