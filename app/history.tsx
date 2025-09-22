
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useHealthData } from '../hooks/useHealthData';
import Icon from '../components/Icon';
import { MoodEntry, SleepEntry, WorkoutEntry } from '../types';

type EntryType = 'all' | 'mood' | 'sleep' | 'workout';

export default function HistoryScreen() {
  const { moodEntries, sleepEntries, workoutEntries } = useHealthData();
  const [selectedType, setSelectedType] = useState<EntryType>('all');

  const getAllEntries = () => {
    const allEntries = [
      ...moodEntries.map(entry => ({ ...entry, type: 'mood' as const })),
      ...sleepEntries.map(entry => ({ ...entry, type: 'sleep' as const })),
      ...workoutEntries.map(entry => ({ ...entry, type: 'workout' as const })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    if (selectedType === 'all') return allEntries;
    return allEntries.filter(entry => entry.type === selectedType);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderEntry = ({ item }: { item: any }) => {
    const getEntryIcon = () => {
      switch (item.type) {
        case 'mood': return 'happy';
        case 'sleep': return 'moon';
        case 'workout': return 'fitness';
        default: return 'document';
      }
    };

    const getEntryColor = () => {
      switch (item.type) {
        case 'mood': return colors.success;
        case 'sleep': return colors.primary;
        case 'workout': return colors.warning;
        default: return colors.textSecondary;
      }
    };

    const getEntryContent = () => {
      switch (item.type) {
        case 'mood':
          const moodEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳', '🌟'];
          return (
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {moodEmojis[item.mood - 1]} Mood: {item.mood}/10
              </Text>
              {item.notes && (
                <Text style={[commonStyles.textSecondary, { marginTop: 4 }]}>
                  {item.notes}
                </Text>
              )}
            </View>
          );
        case 'sleep':
          return (
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                🌙 Sleep: {item.duration}h (Quality: {item.quality}/10)
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 4 }]}>
                {item.bedtime} - {item.wakeTime}
              </Text>
            </View>
          );
        case 'workout':
          return (
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                💪 {item.type}: {item.duration} min (Intensity: {item.intensity}/10)
              </Text>
              {item.notes && (
                <Text style={[commonStyles.textSecondary, { marginTop: 4 }]}>
                  {item.notes}
                </Text>
              )}
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <View style={[commonStyles.smallCard, { marginHorizontal: 20 }]}>
        <View style={commonStyles.row}>
          <View style={{
            backgroundColor: getEntryColor() + '20',
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Icon name={getEntryIcon()} size={20} color={getEntryColor()} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={[commonStyles.row, { marginBottom: 4 }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
            {getEntryContent()}
          </View>
        </View>
      </View>
    );
  };

  const filterButtons = [
    { type: 'all' as EntryType, label: 'All', icon: 'list' as const },
    { type: 'mood' as EntryType, label: 'Mood', icon: 'happy' as const },
    { type: 'sleep' as EntryType, label: 'Sleep', icon: 'moon' as const },
    { type: 'workout' as EntryType, label: 'Workouts', icon: 'fitness' as const },
  ];

  const entries = getAllEntries();

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.row, { paddingHorizontal: 20, paddingBottom: 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
          History
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {filterButtons.map((button) => {
          const isSelected = selectedType === button.type;
          return (
            <TouchableOpacity
              key={button.type}
              style={{
                backgroundColor: isSelected ? colors.primary : colors.backgroundAlt,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
              onPress={() => setSelectedType(button.type)}
            >
              <Icon 
                name={button.icon} 
                size={16} 
                color={isSelected ? colors.backgroundAlt : colors.text} 
              />
              <Text style={{
                marginLeft: 6,
                fontSize: 14,
                fontWeight: '600',
                color: isSelected ? colors.backgroundAlt : colors.text,
              }}>
                {button.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Entries List */}
      {entries.length > 0 ? (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <View style={[commonStyles.center, { flex: 1 }]}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📊</Text>
          <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 8 }]}>
            No entries yet
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            Start logging your mood, sleep, and workouts to see your history here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
