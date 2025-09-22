
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import ProgressRing from './ProgressRing';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  progress?: number; // 0-1 for progress ring
  color?: string;
  onPress?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  progress,
  color = colors.primary,
  onPress,
}: StatCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={commonStyles.smallCard} onPress={onPress}>
      <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.textSecondary}>{title}</Text>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 4 }]}>
            {value}
          </Text>
          {subtitle && (
            <Text style={commonStyles.textSecondary}>{subtitle}</Text>
          )}
        </View>
        
        {progress !== undefined ? (
          <ProgressRing
            progress={progress}
            size={60}
            strokeWidth={6}
            color={color}
          >
            <Icon name={icon} size={24} color={color} />
          </ProgressRing>
        ) : (
          <View style={{
            backgroundColor: color + '20',
            borderRadius: 30,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name={icon} size={24} color={color} />
          </View>
        )}
      </View>
    </CardComponent>
  );
}
