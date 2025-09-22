
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useHealthData } from '../hooks/useHealthData';
import Icon from '../components/Icon';

export default function WorkoutScreen() {
  const { addWorkoutEntry } = useHealthData();
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const workoutTypes = [
    { name: 'Cardio', icon: 'heart' as const, color: colors.danger },
    { name: 'Strength', icon: 'barbell' as const, color: colors.primary },
    { name: 'Yoga', icon: 'leaf' as const, color: colors.success },
    { name: 'Running', icon: 'walk' as const, color: colors.warning },
    { name: 'Swimming', icon: 'water' as const, color: colors.accent },
    { name: 'Cycling', icon: 'bicycle' as const, color: colors.secondary },
  ];

  const intensityLabels = [
    'Very Light', 'Light', 'Easy', 'Moderate', 'Moderate+',
    'Hard', 'Very Hard', 'Intense', 'Very Intense', 'Maximum'
  ];

  const handleSaveWorkout = () => {
    if (!selectedType || !duration) {
      Alert.alert('Missing Information', 'Please select a workout type and enter duration.');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    addWorkoutEntry({
      date: today,
      type: selectedType,
      duration: durationNum,
      intensity,
      notes: notes.trim() || undefined,
    });

    console.log('Workout entry saved:', { type: selectedType, duration: durationNum, intensity });
    
    Alert.alert(
      'Workout Logged!',
      `Your ${selectedType.toLowerCase()} workout has been recorded: ${durationNum} minutes at intensity ${intensity}/10.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, commonStyles.marginBottom]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
            Log Your Workout
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Workout Summary */}
        {selectedType && duration && (
          <View style={[commonStyles.card, commonStyles.center, commonStyles.marginBottom]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>💪</Text>
            <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
              {selectedType} - {duration} min
            </Text>
            <Text style={commonStyles.textSecondary}>
              Intensity: {intensityLabels[intensity - 1]} ({intensity}/10)
            </Text>
          </View>
        )}

        {/* Workout Type Selection */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Workout Type
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {workoutTypes.map((type) => {
              const isSelected = selectedType === type.name;
              
              return (
                <TouchableOpacity
                  key={type.name}
                  style={{
                    flex: 1,
                    minWidth: '30%',
                    backgroundColor: isSelected ? type.color : colors.backgroundAlt,
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: isSelected ? type.color : colors.border,
                  }}
                  onPress={() => setSelectedType(type.name)}
                >
                  <Icon 
                    name={type.icon} 
                    size={24} 
                    color={isSelected ? colors.backgroundAlt : type.color} 
                  />
                  <Text style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: '600',
                    color: isSelected ? colors.backgroundAlt : colors.text,
                  }}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Duration Input */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Duration (minutes)
          </Text>
          <TextInput
            style={[commonStyles.card, {
              fontSize: 16,
              color: colors.text,
              textAlign: 'center',
            }]}
            placeholder="Enter workout duration"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        {/* Intensity Scale */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Intensity Level
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            {Array.from({ length: 10 }, (_, index) => {
              const intensityValue = index + 1;
              const isSelected = intensity === intensityValue;
              
              return (
                <TouchableOpacity
                  key={intensityValue}
                  style={{
                    width: '18%',
                    aspectRatio: 1,
                    backgroundColor: isSelected ? colors.warning : colors.backgroundAlt,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: isSelected ? colors.warning : colors.border,
                  }}
                  onPress={() => setIntensity(intensityValue)}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: isSelected ? colors.backgroundAlt : colors.text,
                  }}>
                    {intensityValue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            {intensityLabels[intensity - 1]}
          </Text>
        </View>

        {/* Notes Section */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Notes (Optional)
          </Text>
          <TextInput
            style={[commonStyles.card, {
              minHeight: 80,
              textAlignVertical: 'top',
              fontSize: 16,
              color: colors.text,
            }]}
            placeholder="Any specific exercises, achievements, or observations?"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, commonStyles.marginBottom]}
          onPress={handleSaveWorkout}
        >
          <Text style={{ color: colors.backgroundAlt, fontSize: 16, fontWeight: '600' }}>
            Save Workout Entry
          </Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
