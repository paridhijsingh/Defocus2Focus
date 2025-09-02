import React from 'react';
import WebTodoScreen from './WebTodoScreen';

/**
 * TodoScreen - Web-compatible todo screen with all features
 * Features: Task management, filtering, sorting, progress tracking
 */
const TodoScreen = ({ onNavigate }) => {
  return <WebTodoScreen onNavigate={onNavigate} />;
};

export default TodoScreen;
