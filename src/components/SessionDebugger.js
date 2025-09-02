import React from 'react';
import { useFocus } from '../contexts/FocusContext';

/**
 * SessionDebugger - Development component to show session state
 * Remove this in production
 */
const SessionDebugger = () => {
  const {
    isDefocusAvailable,
    isDefocusLocked,
    isFocusActive,
    isDefocusUsed,
    completedCyclesToday,
    getDefocusLockMessage,
    getSessionStats,
  } = useFocus();

  const stats = getSessionStats();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <div><strong>Session Debug</strong></div>
      <div>Defocus Available: {isDefocusAvailable() ? '✅' : '❌'}</div>
      <div>Defocus Locked: {isDefocusLocked ? '🔒' : '🔓'}</div>
      <div>Focus Active: {isFocusActive ? '🎯' : '⏸️'}</div>
      <div>Defocus Used: {isDefocusUsed ? '✅' : '❌'}</div>
      <div>Cycles Today: {completedCyclesToday}</div>
      <div style={{ marginTop: '5px', fontSize: '10px' }}>
        {getDefocusLockMessage()}
      </div>
    </div>
  );
};

export default SessionDebugger;
