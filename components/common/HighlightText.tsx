import React from 'react';
import { Text } from 'react-native';
import { indexStyles } from '@/styles/indexStyles';

interface HighlightTextProps {
  text: string | undefined;
  keyword: string;
}

export const HighlightText: React.FC<HighlightTextProps> = React.memo(({ text, keyword }) => {
  if (!keyword || !text) return <>{text || ''}</>;

  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === keyword.toLowerCase()) {
          return (
            <Text key={index} style={indexStyles.highlight}>
              {part}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </>
  );
});

HighlightText.displayName = 'HighlightText';