# 🧪 Session Cycle Test Guide

## How to Test the Defocus → Focus → Unlock Cycle

### **Step 1: Initial State**

1. Open your app
2. Check the debug panel (top-right corner) - you should see:
   - ✅ Defocus Available: Yes
   - 🔓 Defocus Locked: No
   - ⏸️ Focus Active: No
   - ❌ Defocus Used: No
   - Cycles Today: 0

### **Step 2: Test Defocus Access**

1. **Navigation Test**: Click the "Break" button in bottom navigation

   - Should work normally (green leaf icon 🌿)
   - Should navigate to defocus screen

2. **Dashboard Test**: Click "Defocus Break" button on dashboard
   - Should work normally
   - Should navigate to defocus screen

### **Step 3: Use Defocus Activity**

1. Go to Defocus screen
2. Click any defocus activity (Journaling, Mini Game, or AI Therapist)
3. **Expected Result**:
   - Defocus session starts
   - `isDefocusUsed` becomes `true`
   - All defocus features should lock

### **Step 4: Test Defocus Lock**

1. **Navigation Test**: Try clicking "Break" in bottom navigation

   - Should show lock icon (🔒)
   - Should be grayed out
   - Should show alert: "🔒 Defocus Locked - ✨ You're ready to focus now! Defocus will unlock after your session."

2. **Dashboard Test**: Try clicking "Defocus Break" button

   - Should be grayed out
   - Should show same alert message

3. **Direct Access Test**: Try navigating to defocus screen
   - Should redirect to dashboard
   - Should show lock message

### **Step 5: Start Focus Session**

1. Go to Focus screen
2. Click "Start Focus" button
3. **Expected Result**:
   - Focus session starts
   - `isFocusActive` becomes `true`
   - Defocus remains locked

### **Step 6: Test During Focus**

1. **Navigation Test**: Try clicking "Break" in bottom navigation

   - Should show lock icon (🔒)
   - Should show alert: "🔒 Defocus Locked - 🎯 Focus session in progress. Defocus will unlock when you complete your session."

2. **Quick Reset Test**: Go to defocus screen (if accessible)
   - Quick Reset should still be available
   - Other activities should be locked

### **Step 7: Complete Focus Session**

1. Let the focus timer complete OR click "Stop" and confirm
2. **Expected Result**:
   - Focus session ends
   - `isFocusActive` becomes `false`
   - `isDefocusUsed` becomes `false`
   - Defocus unlocks again
   - Cycle counter increases
   - Celebration message appears

### **Step 8: Verify Unlock**

1. **Navigation Test**: Click "Break" in bottom navigation

   - Should show green leaf icon (🌿)
   - Should work normally

2. **Dashboard Test**: Click "Defocus Break" button
   - Should work normally
   - Should navigate to defocus screen

## 🔍 Debug Panel Reference

The debug panel shows real-time session state:

- **Defocus Available**: ✅/❌ - Can user access defocus?
- **Defocus Locked**: 🔒/🔓 - Is defocus currently locked?
- **Focus Active**: 🎯/⏸️ - Is focus session running?
- **Defocus Used**: ✅/❌ - Has defocus been used in current cycle?
- **Cycles Today**: Number - How many complete cycles today?

## 🚨 Expected Behavior

### **When Defocus is Available:**

- Navigation shows green leaf (🌿)
- Dashboard button is green and clickable
- All defocus activities work normally

### **When Defocus is Locked:**

- Navigation shows lock icon (🔒) and is grayed out
- Dashboard button is grayed out and disabled
- Clicking shows appropriate lock message
- Direct navigation redirects to dashboard

### **During Focus Session:**

- Defocus remains locked
- Focus screen shows active session
- Quick Reset is still available

### **After Focus Completion:**

- Defocus unlocks immediately
- Cycle counter increases
- Celebration message appears
- All defocus features become available again

## 🐛 Troubleshooting

### **If Defocus Doesn't Lock After Use:**

- Check if `startDefocus()` is being called
- Verify `isDefocusUsed` becomes `true` in debug panel
- Check console for any errors

### **If Navigation Still Works When Locked:**

- Verify `handleNavigation` function is being used
- Check if `isDefocusAvailable()` returns `false`
- Ensure navigation component is using the new handler

### **If State Doesn't Persist:**

- Check AsyncStorage permissions
- Verify `saveSessionState()` is being called
- Check console for AsyncStorage errors

### **If Quick Reset Doesn't Work:**

- Verify QuickResetModal is imported
- Check if `startQuickReset()` is being called
- Ensure modal state is managed correctly

## ✅ Success Criteria

The session cycle is working correctly if:

1. ✅ Defocus locks immediately after use
2. ✅ Navigation prevents access when locked
3. ✅ Focus session keeps defocus locked
4. ✅ Defocus unlocks after focus completion
5. ✅ Cycle counter increases after completion
6. ✅ State persists across app restarts
7. ✅ Quick Reset always works
8. ✅ Appropriate messages are shown

## 🎯 Test the Complete Cycle

1. **Start**: Defocus available
2. **Use Defocus**: Defocus locks
3. **Start Focus**: Defocus stays locked
4. **Complete Focus**: Defocus unlocks, cycle complete
5. **Repeat**: Can use defocus again

This creates the perfect **Defocus → Focus → Unlock** rhythm! 🌟
