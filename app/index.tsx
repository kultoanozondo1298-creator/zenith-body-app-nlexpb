
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useHealthData } from '../hooks/useHealthData';
import StatCard from '../components/StatCard';
import AICoachCard from '../components/AICoachCard';
import QuickActionButton from '../components/QuickActionButton';
import SimpleBottomSheet from '../components/BottomSheet';

export default function HomeScreen() {
  const { aiTips, getStats } = useHealthData();
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const stats = getStats();

  console.log('Home screen rendered with stats:', stats);

  const quickActions = [
    { title: 'Log Mood', icon: 'happy' as const, color: colors.success, route: '/mood' },
    { title: 'Log Sleep', icon: 'moon' as const, color: colors.primary, route: '/sleep' },
    { title: 'Log Workout', icon: 'fitness' as const, color: colors.warning, route: '/workout' },
    { title: 'View History', icon: 'analytics' as const, color: colors.accent, route: '/history' },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, commonStyles.marginBottom]}>
          <View>
            <Text style={commonStyles.title}>Good Morning!</Text>
            <Text style={commonStyles.textSecondary}>
              How are you feeling today?
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettingsSheet(true)}>
            <View style={{
              backgroundColor: colors.backgroundAlt,
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, commonStyles.marginBottom]}>
            Your Progress
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <StatCard
                title="Average Mood"
                value={stats.averageMood > 0 ? stats.averageMood.toFixed(1) : '--'}
                subtitle="out of 10"
                icon="happy"
                progress={stats.averageMood / 10}
                color={colors.success}
                onPress={() => router.push('/mood')}
              />
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <StatCard
                title="Sleep Average"
                value={stats.averageSleep > 0 ? `${stats.averageSleep.toFixed(1)}h` : '--'}
                subtitle="per night"
                icon="moon"
                progress={Math.min(stats.averageSleep / 8, 1)}
                color={colors.primary}
                onPress={() => router.push('/sleep')}
              />
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <StatCard
                title="Weekly Workouts"
                value={stats.weeklyWorkouts}
                subtitle="this week"
                icon="fitness"
                color={colors.warning}
                onPress={() => router.push('/workout')}
              />
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <StatCard
                title="Streak"
                value={stats.streakDays}
                subtitle="days active"
                icon="flame"
                color={colors.danger}
                onPress={() => router.push('/history')}
              />
            </View>
          </View>
        </View>

        {/* AI Coach Tips */}
        {aiTips.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, commonStyles.marginBottom]}>
              AI Coach Tips
            </Text>
            {aiTips.slice(0, 2).map((tip) => (
              <AICoachCard key={tip.id} tip={tip} />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, commonStyles.marginBottom]}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {quickActions.map((action) => (
              <View key={action.title} style={{ flex: 1, minWidth: '45%' }}>
                <QuickActionButton
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => router.push(action.route)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showSettingsSheet}
        onClose={() => setShowSettingsSheet(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 20 }]}>
            Settings
          </Text>
          <TouchableOpacity 
            style={[commonStyles.smallCard, { alignItems: 'center' }]}
            onPress={() => {
              setShowSettingsSheet(false);
              router.push('/history');
            }}
          >
            <Text style={commonStyles.text}>View All History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[commonStyles.smallCard, { alignItems: 'center' }]}
            onPress={() => setShowSettingsSheet(false)}
          >
            <Text style={commonStyles.text}>About</Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
