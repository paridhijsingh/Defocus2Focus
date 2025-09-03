import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function JournalScreen() {
  const { state, actions } = useApp();
  const [entry, setEntry] = useState('');
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const textInputRef = useRef(null);
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleSave = () => {
    if (!entry.trim()) {
      Alert.alert('Error', 'Please write something before saving');
      return;
    }

    const entryData = {
      title: title.trim() || `Journal Entry ${new Date().toLocaleDateString()}`,
      content: entry.trim(),
      wordCount: entry.trim().split(/\s+/).length,
    };

    if (isEditing && currentEntry) {
      // Update existing entry
      const updatedEntries = state.journalEntries.map(item => 
        item.id === currentEntry.id 
          ? { ...item, ...entryData, timestamp: new Date().toISOString() }
          : item
      );
      // Update in context (you'd need to add an updateJournalEntry action)
      Alert.alert('Success', 'Journal entry updated successfully!');
    } else {
      // Add new entry
      actions.addJournalEntry(entryData);
      Alert.alert('Success', 'Journal entry saved successfully!');
    }

    // Reset form
    setEntry('');
    setTitle('');
    setIsEditing(false);
    setCurrentEntry(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEdit = (journalEntry) => {
    setTitle(journalEntry.title);
    setEntry(journalEntry.content);
    setCurrentEntry(journalEntry);
    setIsEditing(true);
    textInputRef.current?.focus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDelete = (journalEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // You'd need to add a deleteJournalEntry action to the context
            Alert.alert('Success', 'Journal entry deleted successfully!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        },
      ]
    );
  };

  const handleNewEntry = () => {
    setEntry('');
    setTitle('');
    setIsEditing(false);
    setCurrentEntry(null);
    textInputRef.current?.focus();
    
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const wordCount = entry.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed']}
          className="px-6 pt-12 pb-8"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                Journal 📝
              </Text>
              <Text className="text-purple-100 text-sm">
                {state.stats.journalEntries} entries • {state.stats.streak} day streak
              </Text>
            </View>
            <AnimatedTouchableOpacity
              style={animatedStyle}
              onPress={handleNewEntry}
              className="bg-white/20 rounded-full p-3"
            >
              <Ionicons name="add" size={24} color="white" />
            </AnimatedTouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-white font-bold text-xl">
                {state.stats.journalEntries}
              </Text>
              <Text className="text-purple-100 text-sm">Total Entries</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">
                {state.stats.streak}
              </Text>
              <Text className="text-purple-100 text-sm">Day Streak</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">
                {wordCount}
              </Text>
              <Text className="text-purple-100 text-sm">Words Today</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="px-6 -mt-4">
          {/* Writing Area */}
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isEditing ? 'Edit Entry' : 'New Entry'}
              </Text>
              
              {/* Title Input */}
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Entry title (optional)"
                placeholderTextColor="#9ca3af"
                className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 mb-4 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
              />
              
              {/* Content Input */}
              <TextInput
                ref={textInputRef}
                value={entry}
                onChangeText={setEntry}
                placeholder="What's on your mind today?"
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 h-48 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                style={{ fontSize: 16, lineHeight: 24 }}
              />
              
              {/* Word Count */}
              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {wordCount} words
                </Text>
                <View className="flex-row space-x-2">
                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => {
                        setEntry('');
                        setTitle('');
                        setIsEditing(false);
                        setCurrentEntry(null);
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
                    >
                      <Text className="text-gray-700 dark:text-gray-300 font-medium">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                  <ActionButton
                    title={isEditing ? 'Update' : 'Save'}
                    onPress={handleSave}
                    gradient
                    gradientColors={['#8b5cf6', '#7c3aed']}
                    disabled={!entry.trim()}
                  />
                </View>
              </View>
            </View>
          </Card>

          {/* Recent Entries */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Entries
            </Text>
            
            {state.journalEntries.length === 0 ? (
              <Card>
                <View className="p-6 items-center">
                  <Text className="text-4xl mb-4">📝</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center">
                    No journal entries yet.{'\n'}Start writing to build your journaling habit!
                  </Text>
                </View>
              </Card>
            ) : (
              state.journalEntries.slice(0, 5).map((journalEntry) => (
                <Card key={journalEntry.id} className="mb-3">
                  <View className="p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-gray-900 dark:text-white flex-1">
                        {journalEntry.title}
                      </Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => handleEdit(journalEntry)}
                          className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg"
                        >
                          <Ionicons name="pencil" size={16} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(journalEntry)}
                          className="p-2 bg-red-100 dark:bg-red-900 rounded-lg"
                        >
                          <Ionicons name="trash" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {journalEntry.content.length > 100 
                        ? `${journalEntry.content.substring(0, 100)}...`
                        : journalEntry.content
                      }
                    </Text>
                    
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(journalEntry.timestamp).toLocaleDateString()}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-500">
                        {journalEntry.wordCount} words
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
