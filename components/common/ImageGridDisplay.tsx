import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NoData } from './NoData';
import { useTheme } from '@/contexts/ThemeContext';

interface ImageGridDisplayProps {
  images: { url: string; name?: string }[];
  onImagePress?: (images: { url: string; name?: string }[], index: number) => void;
}

export function ImageGridDisplay({ images, onImagePress }: ImageGridDisplayProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      marginHorizontal: -6,
    },
    item: {
      width: '33.33%',
      paddingHorizontal: 6,
      marginBottom: 12,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    emptyContainer: {
      width: '100%',
      height: 160,
      borderRadius: theme.borderRadius.md,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <NoData text="暂无数据" style={{ backgroundColor: 'transparent' }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <View key={image.url} style={styles.item}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => onImagePress?.(images, index)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
