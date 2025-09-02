import React, { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import WebTaskItem from '../components/WebTaskItem';
import WebTaskInput from '../components/WebTaskInput';

/**
 * WebTodoScreen - Web-compatible main todo screen with all features
 * Features: Task management, filtering, sorting, progress tracking
 */
const WebTodoScreen = ({ onNavigate }) => {
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
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // Handle adding new task
  const handleAddTask = (taskData) => {
    addTask(taskData);
    alert('Task added successfully!');
  };

  // Handle editing task
  const handleEditTask = (taskData) => {
    updateTask(editingTask.id, taskData);
    setEditingTask(null);
    alert('Task updated successfully!');
  };

  // Handle deleting task
  const handleDeleteTask = (taskId) => {
    removeTask(taskId);
    alert('Task deleted successfully!');
  };

  // Handle completing task
  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
    alert('Great job! Task completed! 🎉');
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
  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...userData.todoList];

    // Apply filters
    switch (activeFilter) {
      case 'completed':
        filteredTasks = userData.todoList.filter(task => task.completed);
        break;
      case 'pending':
        filteredTasks = userData.todoList.filter(task => !task.completed);
        break;
      case 'overdue':
        filteredTasks = userData.todoList.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate) < new Date();
        });
        break;
      case 'due_today':
        const today = new Date().toDateString();
        filteredTasks = userData.todoList.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate).toDateString() === today;
        });
        break;
      case 'high_priority':
        filteredTasks = userData.todoList.filter(task => 
          task.priority === 'high' || task.priority === 'urgent'
        );
        break;
      default:
        // Filter by category if activeFilter matches a category ID
        const category = categories.find(c => c.id === activeFilter);
        if (category) {
          filteredTasks = userData.todoList.filter(task => task.category === category.id);
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

  const filteredTasks = getFilteredAndSortedTasks();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">
              {taskStats.total} total • {taskStats.completed} completed • {taskStats.pending} pending
            </p>
            {taskStats.overdue > 0 && (
              <p className="text-red-600 font-medium mt-1">
                ⚠️ {taskStats.overdue} overdue task{taskStats.overdue > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm font-bold text-blue-600">
              {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center">
          <p className="text-gray-600 italic">{getMotivationalMessage()}</p>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filters</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'all', label: 'All', icon: '📋' },
              { id: 'pending', label: 'Pending', icon: '⏰' },
              { id: 'completed', label: 'Completed', icon: '✅' },
              { id: 'overdue', label: 'Overdue', icon: '⚠️' },
              { id: 'due_today', label: 'Due Today', icon: '📅' },
              { id: 'high_priority', label: 'High Priority', icon: '🚩' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === category.id
                    ? 'text-white border-transparent'
                    : 'text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: activeFilter === category.id ? category.color : 'transparent'
                }}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="created">Created Date</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <span className="mr-2">➕</span>
          Add New Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No tasks yet!' : 'No tasks found'}
            </h3>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? 'Add your first task to get started'
                : 'Try changing your filters or add a new task'
              }
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <WebTaskItem
              key={task.id}
              task={task}
              categories={categories}
              onComplete={handleCompleteTask}
              onEdit={handleEditTaskPress}
              onDelete={handleDeleteTask}
              onAddSubtask={addSubtask}
              onCompleteSubtask={completeSubtask}
              isExpanded={expandedTasks.has(task.id)}
              onToggleExpansion={toggleTaskExpansion}
            />
          ))
        )}
      </div>

      {/* Task Input Modal */}
      <WebTaskInput
        visible={showAddModal}
        onDismiss={handleCloseModal}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        categories={categories}
        editingTask={editingTask}
        onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
      />
    </div>
  );
};

export default WebTodoScreen;
