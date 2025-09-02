import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  FAB,
  Card,
  Title,
  Text,
  IconButton,
  Portal,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';
import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';
import TaskFilters from '../components/TaskFilters';
import ProgressBar from '../components/ProgressBar';
import NotificationService from '../services/NotificationService';

/**
 * EnhancedTodoScreen - Main todo screen with all features
 * Features: Task management, filtering, sorting, progress tracking, notifications
 */
const EnhancedTodoScreen = ({ navigation }) => {
  const {
    userData,
    addTask,
    updateTask,
    completeTask,
    removeTask,
    addSubtask,
    completeSubtask,
    categories,
  } = useUserData();

  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(true);

  // Initialize notification service
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await NotificationService.initialize();
        console.log('Notifications initialized');
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  // Schedule notifications for tasks with due dates
  useEffect(() => {
    const scheduleTaskNotifications = async () => {
      for (const task of userData.todoList) {
        if (task.dueDate && !task.completed) {
          await NotificationService.scheduleTaskReminders(task);
        }
      }
    };

    scheduleTaskNotifications();
  }, [userData.todoList]);

  // Handle adding new task
  const handleAddTask = async (taskData) => {
    try {
      addTask(taskData);
      
      // Schedule notifications if task has due date
      if (taskData.dueDate) {
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
        };
        await NotificationService.scheduleTaskReminders(newTask);
      }
      
      Alert.alert('Success', 'Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  // Handle editing task
  const handleEditTask = async (taskData) => {
    try {
      // Cancel existing notifications
      await NotificationService.cancelTaskNotifications(editingTask.id);
      
      // Update task
      updateTask(editingTask.id, taskData);
      
      // Schedule new notifications if due date changed
      if (taskData.dueDate) {
        const updatedTask = { ...editingTask, ...taskData };
        await NotificationService.scheduleTaskReminders(updatedTask);
      }
      
      setEditingTask(null);
      Alert.alert('Success', 'Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  // Handle deleting task
  const handleDeleteTask = async (taskId) => {
    try {
      // Cancel notifications
      await NotificationService.cancelTaskNotifications(taskId);
      
      // Remove task
      removeTask(taskId);
      
      Alert.alert('Success', 'Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  // Handle completing task
  const handleCompleteTask = async (taskId) => {
    try {
      // Cancel notifications
      await NotificationService.cancelTaskNotifications(taskId);
      
      // Complete task
      completeTask(taskId);
      
      Alert.alert('Great job!', 'Task completed! 🎉');
    } catch (error) {
      console.error('Error completing task:', error);
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  // Handle opening edit modal
  const handleEditTaskPress = (task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  // Handle closing modals
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

  // Calculate task statistics
  const taskStats = {
    total: userData.todoList.length,
    completed: userData.todoList.filter(task => task.completed).length,
    pending: userData.todoList.filter(task => !task.completed).length,
    overdue: userData.todoList.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length,
  };

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;
    
    if (completionRate >= 100) {
      return "🎉 Amazing! All tasks completed!";
    } else if (completionRate >= 75) {
      return "🔥 You're on fire! Almost there!";
    } else if (completionRate >= 50) {
      return "💪 Great progress! Keep it up!";
    } else if (completionRate >= 25) {
      return "🚀 Good start! You've got this!";
    } else {
      return "🌟 Every step counts! Keep going!";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Title style={styles.title}>My Tasks</Title>
              <IconButton
                icon={showFilters ? "chevron-up" : "chevron-down"}
                size={24}
                onPress={() => setShowFilters(!showFilters)}
                iconColor="#6b7280"
              />
            </View>
            
            <Text style={styles.subtitle}>
              {taskStats.total} total • {taskStats.completed} completed • {taskStats.pending} pending
            </Text>
            
            {taskStats.overdue > 0 && (
              <Text style={styles.overdueWarning}>
                ⚠️ {taskStats.overdue} overdue task{taskStats.overdue > 1 ? 's' : ''}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Progress Bar */}
        <ProgressBar
          completedTasks={taskStats.completed}
          totalTasks={taskStats.total}
          dailyGoal={userData.weeklyGoal || 5}
          showGoal={true}
          animated={true}
        />

        {/* Motivational Message */}
        <Card style={styles.messageCard}>
          <Card.Content style={styles.messageContent}>
            <Text style={styles.motivationalMessage}>
              {getMotivationalMessage()}
            </Text>
          </Card.Content>
        </Card>

        {/* Filters and Sort */}
        {showFilters && (
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            categories={categories}
            showSortOptions={true}
          />
        )}

        {/* Task List */}
        <TaskList
          tasks={userData.todoList}
          categories={categories}
          onCompleteTask={handleCompleteTask}
          onEditTask={handleEditTaskPress}
          onDeleteTask={handleDeleteTask}
          onAddSubtask={addSubtask}
          onCompleteSubtask={completeSubtask}
          activeFilter={activeFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </ScrollView>

      {/* Add Task FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        label="Add Task"
      />

      {/* Task Input Modal */}
      <TaskInput
        visible={showAddModal}
        onDismiss={handleCloseModal}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        categories={categories}
        editingTask={editingTask}
        onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
      />
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
  headerCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  headerContent: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  overdueWarning: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  messageCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
  },
  messageContent: {
    padding: 16,
    alignItems: 'center',
  },
  motivationalMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
});

export default EnhancedTodoScreen;
