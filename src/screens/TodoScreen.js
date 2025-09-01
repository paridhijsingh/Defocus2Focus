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
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';

const TodoScreen = ({ navigation }) => {
  const { 
    userData, 
    addTask, 
    removeTask, 
    completeTask, 
    updateTask,
    addSubtask,
    completeSubtask,
    getTasksByCategory,
    getTasksByPriority,
    getOverdueTasks,
    getTasksDueToday
  } = useUserData();
  
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedDueDate, setSelectedDueDate] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, today, overdue, category, priority
  const [filterValue, setFilterValue] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const taskData = {
        text: newTask.trim(),
        description: newTaskDescription.trim(),
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: selectedDueDate,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
      };
      
      addTask(taskData);
      setNewTask('');
      setNewTaskDescription('');
      setSelectedCategory('personal');
      setSelectedPriority('medium');
      setSelectedDueDate(null);
      setEstimatedTime('');
      setShowAddModal(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditText(task.text);
    setEditDescription(task.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingTask) {
      updateTask(editingTask.id, {
        text: editText.trim(),
        description: editDescription.trim(),
      });
      setShowEditModal(false);
      setEditingTask(null);
      setEditText('');
      setEditDescription('');
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeTask(taskId) },
      ]
    );
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  const handleAddSubtask = (taskId) => {
    if (newSubtask.trim()) {
      addSubtask(taskId, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const handleCompleteSubtask = (taskId, subtaskId) => {
    completeSubtask(taskId, subtaskId);
  };

  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'today':
        return getTasksDueToday();
      case 'overdue':
        return getOverdueTasks();
      case 'category':
        return getTasksByCategory(filterValue);
      case 'priority':
        return getTasksByPriority(filterValue);
      default:
        return userData.todoList;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'alert-circle';
      case 'high': return 'chevron-up';
      case 'medium': return 'remove';
      case 'low': return 'chevron-down';
      default: return 'remove';
    }
  };

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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const renderSubtask = (subtask, taskId) => (
    <View key={subtask.id} style={styles.subtaskItem}>
      <TouchableOpacity
        style={styles.subtaskCheckbox}
        onPress={() => handleCompleteSubtask(taskId, subtask.id)}
      >
        <Ionicons
          name={subtask.completed ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={subtask.completed ? "#10b981" : "#6b7280"}
        />
      </TouchableOpacity>
      <Text style={[
        styles.subtaskText,
        subtask.completed && styles.completedText
      ]}>
        {subtask.text}
      </Text>
    </View>
  );

  const renderTask = (task) => {
    const isExpanded = expandedTasks.has(task.id);
    const category = userData.categories.find(c => c.id === task.category);
    const dueDateText = formatDueDate(task.dueDate);
    const overdue = isOverdue(task.dueDate);

    return (
      <Animated.View
        key={task.id}
        style={[styles.taskItem, { opacity: fadeAnim }]}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskMainInfo}>
            <TouchableOpacity
              style={styles.taskCheckbox}
              onPress={() => handleCompleteTask(task.id)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#10b981"
              />
            </TouchableOpacity>
            
            <View style={styles.taskTextContainer}>
              <Text style={styles.taskText}>{task.text}</Text>
              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
              
              <View style={styles.taskMeta}>
                {category && (
                  <View style={[styles.categoryTag, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon} size={12} color={category.color} />
                    <Text style={[styles.categoryText, { color: category.color }]}>
                      {category.name}
                    </Text>
                  </View>
                )}
                
                <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                  <Ionicons 
                    name={getPriorityIcon(task.priority)} 
                    size={12} 
                    color={getPriorityColor(task.priority)} 
                  />
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority}
                  </Text>
                </View>
                
                {dueDateText && (
                  <View style={[
                    styles.dueDateTag, 
                    { backgroundColor: overdue ? '#ef444420' : '#3b82f620' }
                  ]}>
                    <Ionicons 
                      name="calendar" 
                      size={12} 
                      color={overdue ? '#ef4444' : '#3b82f6'} 
                    />
                    <Text style={[
                      styles.dueDateText, 
                      { color: overdue ? '#ef4444' : '#3b82f6' }
                    ]}>
                      {dueDateText}
                    </Text>
                  </View>
                )}
                
                {task.estimatedTime && (
                  <View style={styles.timeTag}>
                    <Ionicons name="time" size={12} color="#6b7280" />
                    <Text style={styles.timeText}>{task.estimatedTime}m</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.taskActions}>
            {task.subtasks.length > 0 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleTaskExpansion(task.id)}
              >
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditTask(task)}
            >
              <Ionicons name="pencil" size={20} color="#6366f1" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteTask(task.id)}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        {isExpanded && task.subtasks.length > 0 && (
          <View style={styles.subtasksContainer}>
            <Text style={styles.subtasksTitle}>Subtasks</Text>
            {task.subtasks.map(subtask => renderSubtask(subtask, task.id))}
            
            <View style={styles.addSubtaskContainer}>
              <TextInput
                style={styles.subtaskInput}
                placeholder="Add subtask..."
                value={newSubtask}
                onChangeText={setNewSubtask}
                onSubmitEditing={() => handleAddSubtask(task.id)}
              />
              <TouchableOpacity
                style={styles.addSubtaskButton}
                onPress={() => handleAddSubtask(task.id)}
                disabled={!newSubtask.trim()}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={newSubtask.trim() ? "#10b981" : "#9ca3af"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderFilterButton = (filter, label, icon) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Ionicons
        name={icon}
        size={16}
        color={activeFilter === filter ? "#ffffff" : "#6b7280"}
      />
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredTasks = getFilteredTasks();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.innerContent, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
              {activeFilter !== 'all' && ` (${userData.todoList.length} total)`}
            </Text>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderFilterButton('all', 'All', 'list')}
              {renderFilterButton('today', 'Today', 'today')}
              {renderFilterButton('overdue', 'Overdue', 'alert-circle')}
              {userData.categories.map(category => 
                renderFilterButton('category', category.name, category.icon)
              )}
              {['urgent', 'high', 'medium', 'low'].map(priority => 
                renderFilterButton('priority', priority, getPriorityIcon(priority))
              )}
            </ScrollView>
          </View>

          {/* Add Task Button */}
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => setShowAddModal(true)}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.addTaskGradient}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
              <Text style={styles.addTaskButtonText}>Add New Task</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tasks List */}
          <View style={styles.tasksSection}>
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyStateTitle}>
                  {activeFilter === 'all' ? 'No tasks yet!' : 'No tasks found'}
                </Text>
                <Text style={styles.emptyStateText}>
                  {activeFilter === 'all' 
                    ? 'Add your first task to get started'
                    : 'Try changing your filters or add a new task'
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.tasksList}>
                {filteredTasks.map(renderTask)}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Task title"
                value={newTask}
                onChangeText={setNewTask}
              />
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Description (optional)"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.modalSectionTitle}>Category</Text>
              <View style={styles.categoryOptions}>
                {userData.categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      selectedCategory === category.id && styles.selectedCategoryOption
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={20} 
                      color={selectedCategory === category.id ? "#ffffff" : category.color} 
                    />
                    <Text style={[
                      styles.categoryOptionText,
                      selectedCategory === category.id && styles.selectedCategoryOptionText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.modalSectionTitle}>Priority</Text>
              <View style={styles.priorityOptions}>
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      selectedPriority === priority && { backgroundColor: getPriorityColor(priority) }
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Ionicons 
                      name={getPriorityIcon(priority)} 
                      size={16} 
                      color={selectedPriority === priority ? "#ffffff" : getPriorityColor(priority)} 
                    />
                    <Text style={[
                      styles.priorityOptionText,
                      selectedPriority === priority && styles.selectedPriorityOptionText
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.modalSectionTitle}>Estimated Time (minutes)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 30"
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                keyboardType="numeric"
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleAddTask}
                disabled={!newTask.trim()}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Task title"
                value={editText}
                onChangeText={setEditText}
              />
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Description (optional)"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleSaveEdit}
                disabled={!editText.trim()}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  addTaskButton: {
    marginBottom: 20,
  },
  addTaskGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addTaskButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  tasksSection: {
    flex: 1,
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskTextContainer: {
    flex: 1,
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
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dueDateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandButton: {
    padding: 4,
  },
  actionButton: {
    padding: 4,
  },
  subtasksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  subtasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subtaskCheckbox: {
    marginRight: 8,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  subtaskInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    paddingVertical: 8,
  },
  addSubtaskButton: {
    padding: 4,
  },
  emptyState: {
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
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  selectedCategoryOption: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedCategoryOptionText: {
    color: '#ffffff',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedPriorityOptionText: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});

export default TodoScreen;
