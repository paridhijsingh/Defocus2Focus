import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';

const TodoScreen = ({ navigation }) => {
  const { userData, addTask, removeTask, completeTask } = useUserData();
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      // Update the task in the context
      const updatedTasks = userData.todoList.map(task =>
        task.id === editingTask ? { ...task, text: editText.trim() } : task
      );
      // This would need to be implemented in the context
      setEditingTask(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTask(taskId),
        },
      ]
    );
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  const renderTask = (task) => {
    const isEditing = editingTask === task.id;

    return (
      <Animated.View
        key={task.id}
        style={[styles.taskItem, { opacity: fadeAnim }]}
      >
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Ionicons name="checkmark" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.taskContent}>
            <View style={styles.taskTextContainer}>
              <Text style={styles.taskText}>{task.text}</Text>
              <Text style={styles.taskDate}>
                {new Date(task.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleCompleteTask(task.id)}
              >
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.editActionButton]}
                onPress={() => handleEditTask(task)}
              >
                <Ionicons name="pencil" size={20} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteTask(task.id)}
              >
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.innerContent, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              {userData.todoList.length} task{userData.todoList.length !== 1 ? 's' : ''} remaining
            </Text>
          </View>

          {/* Add Task Section */}
          <View style={styles.addTaskSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.taskInput}
                placeholder="Add a new task..."
                value={newTask}
                onChangeText={setNewTask}
                onSubmitEditing={handleAddTask}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}
                disabled={!newTask.trim()}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={newTask.trim() ? '#ffffff' : '#9ca3af'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tasks List */}
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>Your Tasks</Text>
            {userData.todoList.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyStateTitle}>No tasks yet!</Text>
                <Text style={styles.emptyStateText}>
                  Add your first task above to get started
                </Text>
              </View>
            ) : (
              <View style={styles.tasksList}>
                {userData.todoList.map(renderTask)}
              </View>
            )}
          </View>

          {/* Navigation */}
          <View style={styles.navigationSection}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Pomodoro')}
            >
              <Text style={styles.navButtonText}>Start Focus Session</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  innerContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addTaskSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#f0fdf4',
  },
  editActionButton: {
    backgroundColor: '#f0f9ff',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  navigationSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TodoScreen;
