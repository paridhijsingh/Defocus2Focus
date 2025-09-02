import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Chip,
  IconButton,
  Portal,
  Modal,
  Surface,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

/**
 * TaskInput Component - Modal for adding/editing tasks
 * Features: Title, description, category, priority, due date, estimated time
 */
const TaskInput = ({
  visible,
  onDismiss,
  onSubmit,
  categories = [],
  editingTask = null,
  onDelete = null,
}) => {
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: null,
    estimatedTime: '',
    tags: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  // Initialize form data when editing
  React.useEffect(() => {
    if (editingTask) {
      setFormData({
        text: editingTask.text || '',
        description: editingTask.description || '',
        category: editingTask.category || 'personal',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate || null,
        estimatedTime: editingTask.estimatedTime?.toString() || '',
        tags: editingTask.tags || [],
      });
    } else {
      setFormData({
        text: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: null,
        estimatedTime: '',
        tags: [],
      });
    }
  }, [editingTask, visible]);

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.text.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      ...formData,
      text: formData.text.trim(),
      description: formData.description.trim(),
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
    };

    onSubmit(taskData);
    onDismiss();
  };

  // Handle delete task
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            onDelete(editingTask.id);
            onDismiss();
          }
        },
      ]
    );
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

  // Format due date for display
  const formatDueDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  // Get selected category
  const selectedCategory = categories.find(c => c.id === formData.category);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Title style={styles.title}>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </Title>
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
              />
            </View>

            {/* Task Title */}
            <TextInput
              label="Task Title *"
              value={formData.text}
              onChangeText={(text) => setFormData(prev => ({ ...prev, text }))}
              style={styles.input}
              mode="outlined"
              placeholder="Enter task title..."
            />

            {/* Task Description */}
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(description) => setFormData(prev => ({ ...prev, description }))}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Enter task description (optional)..."
            />

            {/* Category Selection */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Category</Title>
              <View style={styles.chipContainer}>
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    selected={formData.category === category.id}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    style={[
                      styles.chip,
                      formData.category === category.id && { backgroundColor: category.color + '20' }
                    ]}
                    textStyle={{
                      color: formData.category === category.id ? category.color : '#374151'
                    }}
                    icon={category.icon}
                  >
                    {category.name}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Priority Selection */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Priority</Title>
              <View style={styles.chipContainer}>
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <Chip
                    key={priority}
                    selected={formData.priority === priority}
                    onPress={() => setFormData(prev => ({ ...prev, priority }))}
                    style={[
                      styles.chip,
                      formData.priority === priority && { backgroundColor: getPriorityColor(priority) + '20' }
                    ]}
                    textStyle={{
                      color: formData.priority === priority ? getPriorityColor(priority) : '#374151'
                    }}
                    icon={getPriorityIcon(priority)}
                  >
                    {priority}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Due Date */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Due Date</Title>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                icon="calendar"
                style={styles.dateButton}
              >
                {formatDueDate(formData.dueDate)}
              </Button>
            </View>

            {/* Estimated Time */}
            <TextInput
              label="Estimated Time (minutes)"
              value={formData.estimatedTime}
              onChangeText={(estimatedTime) => setFormData(prev => ({ ...prev, estimatedTime }))}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="e.g., 30"
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.button}
              >
                Cancel
              </Button>
              
              {editingTask && onDelete && (
                <Button
                  mode="outlined"
                  onPress={handleDelete}
                  style={[styles.button, styles.deleteButton]}
                  textColor="#ef4444"
                >
                  Delete
                </Button>
              )}
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                disabled={!formData.text.trim()}
              >
                {editingTask ? 'Save Changes' : 'Add Task'}
              </Button>
            </View>
          </ScrollView>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    margin: 16,
    marginBottom: 8,
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  dateButton: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
});

export default TaskInput;
