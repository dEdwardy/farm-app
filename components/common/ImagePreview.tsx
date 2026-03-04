import { theme } from '@/styles/theme';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImagePreviewProps {
  visible: boolean;
  images: { url: string; name?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImagePreview({ visible, images, initialIndex = 0, onClose }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, initialIndex, fadeAnim, scaleAnim]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex, images.length]);

  const renderItem = useCallback(
    ({ item }: { item: { url: string; name?: string } }) => (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.url }}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
    ),
    []
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.closeArea} onPress={onClose} activeOpacity={1} />
        
        <Animated.View style={[styles.contentContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.counter}>
              {currentIndex + 1} / {images.length}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {images.length > 1 && (
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrev}
                disabled={currentIndex === 0}
                activeOpacity={0.7}
              >
                <Text style={[styles.navIcon, currentIndex === 0 && styles.navIconDisabled]}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, currentIndex === images.length - 1 && styles.navButtonDisabled]}
                onPress={handleNext}
                disabled={currentIndex === images.length - 1}
                activeOpacity={0.7}
              >
                <Text style={[styles.navIcon, currentIndex === images.length - 1 && styles.navIconDisabled]}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  counter: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT - 250,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navIcon: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 36,
  },
  navIconDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
});
