import React, { useState, useEffect } from 'react';

/**
 * WebTaskInput Component - Web-compatible modal for adding/editing tasks
 * Features: Title, description, category, priority, due date, estimated time
 */
const WebTaskInput = ({
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
    dueDate: '',
    estimatedTime: '',
    tags: [],
  });

  // Initialize form data when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        text: editingTask.text || '',
        description: editingTask.description || '',
        category: editingTask.category || 'personal',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '',
        estimatedTime: editingTask.estimatedTime?.toString() || '',
        tags: editingTask.tags || [],
      });
    } else {
      setFormData({
        text: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: '',
        estimatedTime: '',
        tags: [],
      });
    }
  }, [editingTask, visible]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      ...formData,
      text: formData.text.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
    };

    onSubmit(taskData);
    onDismiss();
  };

  // Handle delete task
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(editingTask.id);
      onDismiss();
    }
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

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              type="button"
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Task Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title..."
                required
              />
            </div>

            {/* Task Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter task description (optional)..."
              />
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.category === category.id
                        ? 'text-white border-transparent'
                        : 'text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: formData.category === category.id ? category.color : 'transparent'
                    }}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.priority === priority
                        ? 'text-white border-transparent'
                        : 'text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: formData.priority === priority ? getPriorityColor(priority) : 'transparent'
                    }}
                  >
                    <span className="mr-1">{getPriorityIcon(priority)}</span>
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estimated Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30"
                min="1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {editingTask && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebTaskInput;
