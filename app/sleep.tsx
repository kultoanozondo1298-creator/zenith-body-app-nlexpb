
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useHealthData } from '../hooks/useHealthData';
import Icon from '../components/Icon';

export default function SleepScreen() {
  const { addSleepEntry } = useHealthData();
  const [bedtime, setBedtime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [quality, setQuality] = useState<number>(7);
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);

  const calculateDuration = () => {
    let duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    if (duration < 0) duration += 24; // Handle overnight sleep
    return Math.round(duration * 10) / 10;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveSleep = () => {
    const today = new Date().toISOString().split('T')[0];
    const duration = calculateDuration();
    
    addSleepEntry({
      date: today,
      bedtime: formatTime(bedtime),
      wakeTime: formatTime(wakeTime),
      quality,
      duration,
    });

    console.log('Sleep entry saved:', { bedtime: formatTime(bedtime), wakeTime: formatTime(wakeTime), quality, duration });
    
    Alert.alert(
      'Sleep Logged!',
      `Your sleep data has been recorded: ${duration} hours with quality ${quality}/10.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const qualityLabels = [
    'Terrible', 'Very Poor', 'Poor', 'Below Average', 'Fair',
    'Good', 'Very Good', 'Great', 'Excellent', 'Perfect'
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, commonStyles.marginBottom]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
            Log Your Sleep
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Sleep Summary */}
        <View style={[commonStyles.card, commonStyles.center, commonStyles.marginBottom]}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🌙</Text>
          <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
            {calculateDuration()} hours
          </Text>
          <Text style={commonStyles.textSecondary}>
            Quality: {qualityLabels[quality - 1]} ({quality}/10)
          </Text>
        </View>

        {/* Time Selection */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Sleep Times
          </Text>
          
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={[commonStyles.smallCard, commonStyles.row]}
              onPress={() => setShowBedtimePicker(true)}
            >
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.textSecondary}>Bedtime</Text>
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                  {formatTime(bedtime)}
                </Text>
              </View>
              <Icon name="time" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[commonStyles.smallCard, commonStyles.row]}
              onPress={() => setShowWakeTimePicker(true)}
            >
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.textSecondary}>Wake Time</Text>
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                  {formatTime(wakeTime)}
                </Text>
              </View>
              <Icon name="sunny" size={24} color={colors.warning} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sleep Quality */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Sleep Quality
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            {Array.from({ length: 10 }, (_, index) => {
              const qualityValue = index + 1;
              const isSelected = quality === qualityValue;
              
              return (
                <TouchableOpacity
                  key={qualityValue}
                  style={{
                    width: '18%',
                    aspectRatio: 1,
                    backgroundColor: isSelected ? colors.primary : colors.backgroundAlt,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                  onPress={() => setQuality(qualityValue)}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: isSelected ? colors.backgroundAlt : colors.text,
                  }}>
                    {qualityValue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            {qualityLabels[quality - 1]}
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, commonStyles.marginBottom]}
          onPress={handleSaveSleep}
        >
          <Text style={{ color: colors.backgroundAlt, fontSize: 16, fontWeight: '600' }}>
            Save Sleep Entry
          </Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date/Time Pickers */}
      {showBedtimePicker && (
        <DateTimePicker
          value={bedtime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowBedtimePicker(false);
            if (selectedDate) setBedtime(selectedDate);
          }}
        />
      )}

      {showWakeTimePicker && (
        <DateTimePicker
          value={wakeTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowWakeTimePicker(false);
            if (selectedDate) setWakeTime(selectedDate);
          }}
        />
      )}
    </SafeAreaView>
  );
}
