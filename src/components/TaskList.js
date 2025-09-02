import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Chip, Card, Title, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';

/**
 * TaskList Component - Displays filtered and sorted list of tasks
 * Features: Filtering, sorting, empty states, progress tracking
 */
const TaskList = ({
  tasks = [],
  categories = [],
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  onCompleteSubtask,
  activeFilter = 'all',
  sortBy = 'created',
  sortOrder = 'desc',
}) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // Toggle task expansion for subtasks
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = [...tasks];

    // Apply filters
    switch (activeFilter) {
      case 'completed':
        filteredTasks = tasks.filter(task => task.completed);
        break;
      case 'pending':
        filteredTasks = tasks.filter(task => !task.completed);
        break;
      case 'overdue':
        filteredTasks = tasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate) < new Date();
        });
        break;
      case 'due_today':
        const today = new Date().toDateString();
        filteredTasks = tasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate).toDateString() === today;
        });
        break;
      case 'high_priority':
        filteredTasks = tasks.filter(task => 
          task.priority === 'high' || task.priority === 'urgent'
        );
        break;
      default:
        // Filter by category if activeFilter matches a category ID
        const category = categories.find(c => c.id === activeFilter);
        if (category) {
          filteredTasks = tasks.filter(task => task.category === category.id);
        }
        break;
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'due_date':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'created':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'alphabetical':
          comparison = a.text.localeCompare(b.text);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredTasks;
  }, [tasks, activeFilter, sortBy, sortOrder, categories]);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    const dueToday = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate).toDateString() === new Date().toDateString();
    }).length;

    return { total, completed, pending, overdue, dueToday };
  }, [tasks]);

  // Render empty state
  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      switch (activeFilter) {
        case 'completed':
          return {
            icon: 'checkmark-circle-outline',
            title: 'No completed tasks',
            message: 'Complete some tasks to see them here!'
          };
        case 'pending':
          return {
            icon: 'list-outline',
            title: 'No pending tasks',
            message: 'Great job! All tasks are completed.'
          };
        case 'overdue':
          return {
            icon: 'alert-circle-outline',
            title: 'No overdue tasks',
            message: 'You\'re staying on top of your deadlines!'
          };
        case 'due_today':
          return {
            icon: 'today-outline',
            title: 'No tasks due today',
            message: 'Enjoy your free day or add some tasks!'
          };
        default:
          return {
            icon: 'add-circle-outline',
            title: 'No tasks yet',
            message: 'Add your first task to get started!'
          };
      }
    };

    const { icon, title, message } = getEmptyMessage();

    return (
      <Card style={styles.emptyStateCard}>
        <Card.Content style={styles.emptyStateContent}>
          <Ionicons name={icon} size={64} color="#9ca3af" />
          <Title style={styles.emptyStateTitle}>{title}</Title>
          <Text style={styles.emptyStateMessage}>{message}</Text>
        </Card.Content>
      </Card>
    );
  };

  // Render task item
  const renderTaskItem = ({ item: task }) => (
    <TaskItem
      task={task}
      categories={categories}
      onComplete={onCompleteTask}
      onEdit={onEditTask}
      onDelete={onDeleteTask}
      onAddSubtask={onAddSubtask}
      onCompleteSubtask={onCompleteSubtask}
      isExpanded={expandedTasks.has(task.id)}
      onToggleExpansion={toggleTaskExpansion}
    />
  );

  return (
    <View style={styles.container}>
      {/* Task Statistics */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.statsTitle}>Task Overview</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{taskStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10b981' }]}>
                {taskStats.completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                {taskStats.pending}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                {taskStats.overdue}
              </Text>
              <Text style={styles.statLabel}>Overdue</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Task List */}
      <FlatList
        data={filteredAndSortedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  separator: {
    height: 8,
  },
  emptyStateCard: {
    margin: 16,
    borderRadius: 12,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default TaskList;
