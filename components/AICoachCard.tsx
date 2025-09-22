
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { AICoachTip } from '../types';

interface AICoachCardProps {
  tip: AICoachTip;
  onDismiss?: () => void;
}

export default function AICoachCard({ tip, onDismiss }: AICoachCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      default: return colors.success;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sleep': return 'moon' as const;
      case 'mood': return 'happy' as const;
      case 'workout': return 'fitness' as const;
      default: return 'bulb' as const;
    }
  };

  return (
    <View style={[commonStyles.card, { borderLeftWidth: 4, borderLeftColor: getPriorityColor(tip.priority) }]}>
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Icon 
              name={getTypeIcon(tip.type)} 
              size={20} 
              color={getPriorityColor(tip.priority)} 
            />
            <Text style={[commonStyles.subtitle, { fontSize: 16, marginLeft: 8, marginBottom: 0 }]}>
              {tip.title}
            </Text>
          </View>
          <Text style={commonStyles.text}>{tip.message}</Text>
        </View>
        
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
