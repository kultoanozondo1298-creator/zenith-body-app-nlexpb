
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface QuickActionButtonProps {
  title: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
}

export default function QuickActionButton({
  title,
  icon,
  color = colors.primary,
  onPress,
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity 
      style={[commonStyles.smallCard, { alignItems: 'center', minHeight: 100 }]} 
      onPress={onPress}
    >
      <View style={{
        backgroundColor: color + '20',
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[commonStyles.text, { textAlign: 'center', fontSize: 14 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
