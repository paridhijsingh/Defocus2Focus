import React from 'react';
import EnhancedDefocusBreak from './EnhancedDefocusBreak';

/**
 * DefocusBreak - Wrapper component that uses the enhanced defocus break screen
 * This maintains backward compatibility while providing the new session cycle logic
 */
const DefocusBreak = ({ onNavigate }) => {
  return <EnhancedDefocusBreak onNavigate={onNavigate} />;
};

export default DefocusBreak;