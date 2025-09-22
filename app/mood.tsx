
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useHealthData } from '../hooks/useHealthData';
import Icon from '../components/Icon';

export default function MoodScreen() {
  const { addMoodEntry } = useHealthData();
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const moodEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳', '🌟'];
  const moodLabels = [
    'Terrible', 'Very Bad', 'Bad', 'Poor', 'Okay', 
    'Good', 'Great', 'Excellent', 'Amazing', 'Perfect'
  ];

  const handleSaveMood = () => {
    const today = new Date().toISOString().split('T')[0];
    
    addMoodEntry({
      date: today,
      mood: selectedMood,
      notes: notes.trim() || undefined,
    });

    console.log('Mood entry saved:', { mood: selectedMood, notes });
    
    Alert.alert(
      'Mood Logged!',
      'Your mood has been recorded successfully.',
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
            Log Your Mood
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Current Selection Display */}
        <View style={[commonStyles.card, commonStyles.center, commonStyles.marginBottom]}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>
            {moodEmojis[selectedMood - 1]}
          </Text>
          <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
            {moodLabels[selectedMood - 1]}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {selectedMood}/10
          </Text>
        </View>

        {/* Mood Scale */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            How are you feeling today?
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            {moodEmojis.map((emoji, index) => {
              const moodValue = index + 1;
              const isSelected = selectedMood === moodValue;
              
              return (
                <TouchableOpacity
                  key={moodValue}
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
                  onPress={() => setSelectedMood(moodValue)}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  <Text style={{
                    fontSize: 10,
                    color: isSelected ? colors.backgroundAlt : colors.textSecondary,
                    marginTop: 2,
                  }}>
                    {moodValue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes Section */}
        <View style={commonStyles.marginBottom}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Notes (Optional)
          </Text>
          <TextInput
            style={[commonStyles.card, {
              minHeight: 100,
              textAlignVertical: 'top',
              fontSize: 16,
              color: colors.text,
            }]}
            placeholder="What's on your mind? Any specific thoughts or events affecting your mood?"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, commonStyles.marginBottom]}
          onPress={handleSaveMood}
        >
          <Text style={{ color: colors.backgroundAlt, fontSize: 16, fontWeight: '600' }}>
            Save Mood Entry
          </Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
