import React, { useState, useEffect } from 'react';
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
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

const moodEmojis = ['😊', '😌', '😐', '😔', '😴', '🤔', '💪', '🎯', '🌟', '❤️'];

export default function JournalScreen() {
  const { state, actions } = useApp();
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [entryTitle, setEntryTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) {
      Alert.alert('Error', 'Please write something before saving');
      return;
    }

    const entry = {
      title: entryTitle.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: currentEntry.trim(),
      mood: selectedMood,
      timestamp: new Date().toISOString(),
    };

    if (isEditing && editingEntry) {
      // Update existing entry
      const updatedEntries = state.journalEntries.map(entry => 
        entry.id === editingEntry.id ? { ...entry, ...entry } : entry
      );
      actions.setUser({ journalEntries: updatedEntries });
    } else {
      // Add new entry
      actions.addJournalEntry(entry);
    }

    // Reset form
    setCurrentEntry('');
    setEntryTitle('');
    setSelectedMood('😊');
    setIsEditing(false);
    setEditingEntry(null);
    
    Alert.alert('Success', 'Journal entry saved!');
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry(entry.content);
    setEntryTitle(entry.title);
    setSelectedMood(entry.mood);
    setIsEditing(true);
    setEditingEntry(entry);
  };

  const handleDeleteEntry = (entryId) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedEntries = state.journalEntries.filter(entry => entry.id !== entryId);
            actions.setUser({ journalEntries: updatedEntries });
          }
        }
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                📝 Journal
              </Text>
              <Text className="text-purple-100 text-sm">
                {state.journalEntries.length} entries • Reflect & grow
              </Text>
            </View>
            <TouchableOpacity className="bg-white/20 rounded-full p-2">
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="px-6 -mt-4">
          {/* New Entry Card */}
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {isEditing ? 'Edit Entry' : 'New Journal Entry'}
              </Text>

              {/* Title Input */}
              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Title (optional)
                </Text>
                <TextInput
                  value={entryTitle}
                  onChangeText={setEntryTitle}
                  placeholder="Give your entry a title..."
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                />
              </View>

              {/* Mood Selection */}
              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  How are you feeling?
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row">
                    {moodEmojis.map((mood) => (
                      <TouchableOpacity
                        key={mood}
                        onPress={() => setSelectedMood(mood)}
                        className={`mr-3 p-3 rounded-full ${
                          selectedMood === mood
                            ? 'bg-purple-100 dark:bg-purple-900'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <Text className="text-2xl">{mood}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Content Input */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  What's on your mind?
                </Text>
                <TextInput
                  value={currentEntry}
                  onChangeText={setCurrentEntry}
                  placeholder="Write your thoughts, reflections, or anything you'd like to remember..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 min-h-[120px]"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between">
                {isEditing && (
                  <ActionButton
                    title="Cancel"
                    onPress={() => {
                      setIsEditing(false);
                      setEditingEntry(null);
                      setCurrentEntry('');
                      setEntryTitle('');
                      setSelectedMood('😊');
                    }}
                    variant="outline"
                    size="md"
                    className="flex-1 mr-2"
                  />
                )}
                <ActionButton
                  title={isEditing ? 'Update Entry' : 'Save Entry'}
                  onPress={handleSaveEntry}
                  gradient
                  gradientColors={['#8b5cf6', '#7c3aed']}
                  size="md"
                  icon="💾"
                  className={isEditing ? 'flex-1 ml-2' : 'w-full'}
                />
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
                <View className="p-8 items-center">
                  <Text className="text-6xl mb-4">📝</Text>
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No entries yet
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center">
                    Start writing your first journal entry above to begin your reflection journey.
                  </Text>
                </View>
              </Card>
            ) : (
              state.journalEntries.slice(0, 5).map((entry, index) => (
                <Card key={entry.id} className="mb-3">
                  <View className="p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {entry.title}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(entry.timestamp)}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-2xl mr-2">{entry.mood}</Text>
                        <TouchableOpacity
                          onPress={() => handleEditEntry(entry)}
                          className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-2"
                        >
                          <Ionicons name="create-outline" size={16} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteEntry(entry.id)}
                          className="bg-red-100 dark:bg-red-900 rounded-full p-2"
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text className="text-gray-700 dark:text-gray-300 leading-6">
                      {entry.content.length > 150 
                        ? `${entry.content.substring(0, 150)}...` 
                        : entry.content
                      }
                    </Text>
                  </View>
                </Card>
              ))
            )}
          </View>

          {/* Journal Stats */}
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Journal Stats
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {state.journalEntries.length}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Total Entries
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {state.journalEntries.filter(entry => {
                      const entryDate = new Date(entry.timestamp);
                      const today = new Date();
                      return entryDate.toDateString() === today.toDateString();
                    }).length}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Today
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {state.journalEntries.filter(entry => {
                      const entryDate = new Date(entry.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    }).length}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    This Week
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
