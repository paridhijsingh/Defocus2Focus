import React, { useState } from 'react';

/**
 * WebTaskItem Component - Web-compatible version of TaskItem
 * Features: Complete/incomplete toggle, edit, delete, subtasks, due dates, priority
 */
const WebTaskItem = ({
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
  const [fadeAnim] = useState(1);

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
      case 'urgent': return '⚠️';
      case 'high': return '⬆️';
      case 'medium': return '➖';
      case 'low': return '⬇️';
      default: return '➖';
    }
  };

  // Handle task completion
  const handleComplete = () => {
    onComplete(task.id);
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  // Calculate subtask completion percentage
  const subtaskCompletion = task.subtasks?.length > 0 
    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
    : 0;

  const dueDateText = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Main Task Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <button
            onClick={handleComplete}
            className={`w-6 h-6 rounded-full border-2 mr-3 mt-1 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && '✓'}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-1 ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.text}
            </h3>
            
            {task.description && (
              <p className={`text-sm mb-3 ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            {/* Task Meta Information */}
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Category Tag */}
              {category && (
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: category.color + '20',
                    color: category.color 
                  }}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </span>
              )}
              
              {/* Priority Tag */}
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: getPriorityColor(task.priority) + '20',
                  color: getPriorityColor(task.priority) 
                }}
              >
                <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                {task.priority}
              </span>
              
              {/* Due Date Tag */}
              {dueDateText && (
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: overdue ? '#ef444420' : '#3b82f620',
                    color: overdue ? '#ef4444' : '#3b82f6'
                  }}
                >
                  <span className="mr-1">📅</span>
                  {dueDateText}
                </span>
              )}
              
              {/* Estimated Time Tag */}
              {task.estimatedTime && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <span className="mr-1">⏱️</span>
                  {task.estimatedTime}m
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Task Actions */}
        <div className="flex items-center space-x-2">
          {task.subtasks?.length > 0 && (
            <button
              onClick={() => onToggleExpansion(task.id)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
          
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-blue-500 hover:text-blue-700"
          >
            ✏️
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Subtasks Section */}
      {isExpanded && task.subtasks?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Subtasks</h4>
            <span className="text-xs text-gray-500">
              {Math.round(subtaskCompletion)}% complete
            </span>
          </div>
          
          {/* Progress Bar for Subtasks */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${subtaskCompletion}%` }}
            />
          </div>
          
          {/* Subtasks List */}
          <div className="space-y-2">
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center">
                <button
                  onClick={() => onCompleteSubtask(task.id, subtask.id)}
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    subtask.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {subtask.completed && '✓'}
                </button>
                <span className={`text-sm ${
                  subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                }`}>
                  {subtask.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebTaskItem;
