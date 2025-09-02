import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Checkbox, Chip, Button, IconButton } from 'react-native-paper';

/**
 * TaskItem Component - Displays individual task with all functionality
 * Features: Complete/incomplete toggle, edit, delete, subtasks, due dates, priority
 */
const TaskItem = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  onAddSubtask,
  onCompleteSubtask,
  categories = [],
  isExpanded = false,
  onToggleExpansion,
}) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get category information
  const category = categories.find(c => c.id === task.category);

  // Format due date for display
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'alert-circle';
      case 'high': return 'chevron-up';
      case 'medium': return 'remove';
      case 'low': return 'chevron-down';
      default: return 'remove';
    }
  };

  // Handle task completion with animation
  const handleComplete = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onComplete(task.id);
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  // Calculate subtask completion percentage
  const subtaskCompletion = task.subtasks?.length > 0 
    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
    : 0;

  const dueDateText = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Card style={styles.card} elevation={2}>
        <Card.Content style={styles.content}>
          {/* Main Task Header */}
          <View style={styles.taskHeader}>
            <View style={styles.taskMainInfo}>
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={handleComplete}
                color="#10b981"
                uncheckedColor="#6b7280"
              />
              
              <View style={styles.taskTextContainer}>
                <Text style={[
                  styles.taskText,
                  task.completed && styles.completedText
                ]}>
                  {task.text}
                </Text>
                
                {task.description && (
                  <Text style={[
                    styles.taskDescription,
                    task.completed && styles.completedText
                  ]}>
                    {task.description}
                  </Text>
                )}
                
                {/* Task Meta Information */}
                <View style={styles.taskMeta}>
                  {/* Category Tag */}
                  {category && (
                    <Chip
                      icon={category.icon}
                      style={[styles.chip, { backgroundColor: category.color + '20' }]}
                      textStyle={{ color: category.color, fontSize: 12 }}
                      compact
                    >
                      {category.name}
                    </Chip>
                  )}
                  
                  {/* Priority Tag */}
                  <Chip
                    icon={getPriorityIcon(task.priority)}
                    style={[styles.chip, { backgroundColor: getPriorityColor(task.priority) + '20' }]}
                    textStyle={{ color: getPriorityColor(task.priority), fontSize: 12 }}
                    compact
                  >
                    {task.priority}
                  </Chip>
                  
                  {/* Due Date Tag */}
                  {dueDateText && (
                    <Chip
                      icon="calendar"
                      style={[
                        styles.chip,
                        { backgroundColor: overdue ? '#ef444420' : '#3b82f620' }
                      ]}
                      textStyle={{
                        color: overdue ? '#ef4444' : '#3b82f6',
                        fontSize: 12
                      }}
                      compact
                    >
                      {dueDateText}
                    </Chip>
                  )}
                  
                  {/* Estimated Time Tag */}
                  {task.estimatedTime && (
                    <Chip
                      icon="clock"
                      style={[styles.chip, { backgroundColor: '#f3f4f6' }]}
                      textStyle={{ color: '#6b7280', fontSize: 12 }}
                      compact
                    >
                      {task.estimatedTime}m
                    </Chip>
                  )}
                </View>
              </View>
            </View>
            
            {/* Task Actions */}
            <View style={styles.taskActions}>
              {task.subtasks?.length > 0 && (
                <IconButton
                  icon={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  onPress={() => onToggleExpansion(task.id)}
                />
              )}
              
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEdit(task)}
                iconColor="#6366f1"
              />
              
              <IconButton
                icon="delete"
                size={20}
                onPress={handleDelete}
                iconColor="#ef4444"
              />
            </View>
          </View>
          
          {/* Subtasks Section */}
          {isExpanded && task.subtasks?.length > 0 && (
            <View style={styles.subtasksContainer}>
              <View style={styles.subtasksHeader}>
                <Text style={styles.subtasksTitle}>Subtasks</Text>
                <Text style={styles.subtasksProgress}>
                  {Math.round(subtaskCompletion)}% complete
                </Text>
              </View>
              
              {/* Progress Bar for Subtasks */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      { width: `${subtaskCompletion}%` }
                    ]}
                  />
                </View>
              </View>
              
              {/* Subtasks List */}
              {task.subtasks.map(subtask => (
                <View key={subtask.id} style={styles.subtaskItem}>
                  <Checkbox
                    status={subtask.completed ? 'checked' : 'unchecked'}
                    onPress={() => onCompleteSubtask(task.id, subtask.id)}
                    color="#10b981"
                    uncheckedColor="#6b7280"
                  />
                  <Text style={[
                    styles.subtaskText,
                    subtask.completed && styles.completedText
                  ]}>
                    {subtask.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskMainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    height: 28,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtasksContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  subtasksProgress: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
});

export default TaskItem;
