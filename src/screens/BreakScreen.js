import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

const breakActivities = [
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    icon: '🫁',
    color: ['#10b981', '#059669'],
    description: 'Calm your mind with guided breathing',
    duration: '5 min',
    steps: [
      'Find a comfortable position',
      'Close your eyes gently',
      'Breathe in for 4 counts',
      'Hold for 4 counts',
      'Breathe out for 6 counts',
      'Repeat for 5 minutes'
    ]
  },
  {
    id: 'stretching',
    title: 'Quick Stretch',
    icon: '🤸',
    color: ['#f59e0b', '#d97706'],
    description: 'Relieve tension with simple stretches',
    duration: '3 min',
    steps: [
      'Neck rolls - 30 seconds',
      'Shoulder shrugs - 30 seconds',
      'Arm circles - 30 seconds',
      'Wrist stretches - 30 seconds',
      'Back twists - 30 seconds',
      'Leg stretches - 30 seconds'
    ]
  },
  {
    id: 'meditation',
    title: 'Mindful Meditation',
    icon: '🧘',
    color: ['#8b5cf6', '#7c3aed'],
    description: 'Practice mindfulness and awareness',
    duration: '10 min',
    steps: [
      'Sit comfortably with eyes closed',
      'Focus on your breathing',
      'Notice thoughts without judgment',
      'Return focus to breath when distracted',
      'Practice gratitude',
      'Slowly open your eyes'
    ]
  },
  {
    id: 'walking',
    title: 'Walking Break',
    icon: '🚶',
    color: ['#3b82f6', '#1d4ed8'],
    description: 'Get moving and refresh your mind',
    duration: '5 min',
    steps: [
      'Stand up from your desk',
      'Walk around your space',
      'Go outside if possible',
      'Focus on your surroundings',
      'Take deep breaths',
      'Return refreshed'
    ]
  },
  {
    id: 'hydration',
    title: 'Hydration Break',
    icon: '💧',
    color: ['#06b6d4', '#0891b2'],
    description: 'Rehydrate and refresh your body',
    duration: '2 min',
    steps: [
      'Get a glass of water',
      'Drink slowly and mindfully',
      'Notice the temperature and taste',
      'Feel the water nourishing your body',
      'Take a moment to appreciate',
      'Return to your work refreshed'
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    icon: '🙏',
    color: ['#ef4444', '#dc2626'],
    description: 'Reflect on positive moments',
    duration: '3 min',
    steps: [
      'Think of 3 things you\'re grateful for',
      'Write them down or say them aloud',
      'Feel the positive emotions',
      'Notice how gratitude feels in your body',
      'Carry this feeling forward',
      'Return with a positive mindset'
    ]
  }
];

export default function BreakScreen() {
  const { state } = useApp();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startActivity = (activity) => {
    setSelectedActivity(activity);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (selectedActivity && currentStep < selectedActivity.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishActivity();
    }
  };

  const finishActivity = () => {
    setIsActive(false);
    setSelectedActivity(null);
    setCurrentStep(0);
    
    // Award small XP for completing break activity
    actions.updateStats({
      xp: state.stats.xp + 5,
      coins: state.stats.coins + 2,
    });
  };

  const renderActivityCard = (activity) => (
    <Card key={activity.id} className="mb-4">
      <TouchableOpacity onPress={() => startActivity(activity)}>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-4xl mr-4">{activity.icon}</Text>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {activity.title}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 mb-2">
                {activity.description}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-500">
                Duration: {activity.duration}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (isActive && selectedActivity) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <LinearGradient
          colors={selectedActivity.color}
          className="px-6 pt-12 pb-8"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                {selectedActivity.icon} {selectedActivity.title}
              </Text>
              <Text className="text-white/80 text-sm">
                Step {currentStep + 1} of {selectedActivity.steps.length}
              </Text>
            </View>
            <TouchableOpacity
              onPress={finishActivity}
              className="bg-white/20 rounded-full p-2"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="flex-1 px-6 -mt-4">
          <Card className="mb-6">
            <View className="p-8">
              <View className="items-center mb-8">
                <Text className="text-6xl mb-4">{selectedActivity.icon}</Text>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  {selectedActivity.steps[currentStep]}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                  {selectedActivity.duration} • Step {currentStep + 1}/{selectedActivity.steps.length}
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
                <View 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${((currentStep + 1) / selectedActivity.steps.length) * 100}%`,
                    backgroundColor: selectedActivity.color[0]
                  }}
                />
              </View>

              <ActionButton
                title={currentStep === selectedActivity.steps.length - 1 ? "Complete" : "Next Step"}
                onPress={nextStep}
                gradient
                gradientColors={selectedActivity.color}
                size="lg"
                className="w-full"
              />
            </View>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              ☕ Break Time
            </Text>
            <Text className="text-orange-100 text-sm">
              Recharge and refresh your mind
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="pause-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        {/* Quick Stats */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Today's Breaks
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {state.stats.todaySessions}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Focus Sessions
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.floor(state.stats.todaySessions * 0.8)}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Breaks Taken
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {state.stats.streak}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Day Streak
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Break Activities */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Break Activities
          </Text>
          {breakActivities.map(renderActivityCard)}
        </View>

        {/* Break Benefits */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 Why Breaks Matter
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Mental Refresh:</Text> Clear your mind and return with fresh perspective
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Physical Health:</Text> Reduce eye strain and muscle tension
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Better Focus:</Text> Improve concentration and productivity
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Stress Relief:</Text> Lower cortisol levels and anxiety
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
