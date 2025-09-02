import React from 'react';
import EnhancedFocusSession from './EnhancedFocusSession';

/**
 * FocusSession - Wrapper component that uses the enhanced focus session screen
 * This maintains backward compatibility while providing the new session cycle logic
 */
const FocusSession = ({ onNavigate }) => {
  return <EnhancedFocusSession onNavigate={onNavigate} />;
};

export default FocusSession;