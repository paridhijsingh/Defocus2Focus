import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * NotificationService - Handles push notifications for task reminders
 * Features: Due date reminders, local notifications, notification permissions
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.notificationIds = new Set();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  /**
   * Schedule a notification for a task due date
   * @param {Object} task - Task object with due date
   * @param {string} reminderType - Type of reminder (due_date, overdue, etc.)
   */
  async scheduleTaskReminder(task, reminderType = 'due_date') {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const now = new Date();

    // Don't schedule notifications for past dates
    if (dueDate <= now) return null;

    let notificationId;
    let triggerTime;

    switch (reminderType) {
      case 'due_date':
        // Remind 1 hour before due date
        triggerTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
        break;
      case 'due_soon':
        // Remind 1 day before due date
        triggerTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'overdue':
        // Remind when task becomes overdue
        triggerTime = dueDate;
        break;
      default:
        triggerTime = dueDate;
    }

    // Don't schedule if trigger time is in the past
    if (triggerTime <= now) return null;

    try {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: this.getNotificationTitle(reminderType),
          body: this.getNotificationBody(task, reminderType),
          data: {
            taskId: task.id,
            taskTitle: task.text,
            reminderType,
          },
          sound: 'default',
        },
        trigger: {
          date: triggerTime,
        },
      });

      this.notificationIds.add(notificationId);
      console.log(`Scheduled notification ${notificationId} for task ${task.id}`);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Schedule multiple reminders for a task
   * @param {Object} task - Task object
   */
  async scheduleTaskReminders(task) {
    if (!task.dueDate) return [];

    const reminders = [];
    
    // Schedule 1 day before reminder
    const dayBeforeId = await this.scheduleTaskReminder(task, 'due_soon');
    if (dayBeforeId) reminders.push(dayBeforeId);

    // Schedule 1 hour before reminder
    const hourBeforeId = await this.scheduleTaskReminder(task, 'due_date');
    if (hourBeforeId) reminders.push(hourBeforeId);

    return reminders;
  }

  /**
   * Cancel all notifications for a specific task
   * @param {string} taskId - Task ID
   */
  async cancelTaskNotifications(taskId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.taskId === taskId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          this.notificationIds.delete(notification.identifier);
        }
      }
      
      console.log(`Cancelled notifications for task ${taskId}`);
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  /**
   * Cancel a specific notification
   * @param {string} notificationId - Notification ID
   */
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      this.notificationIds.delete(notificationId);
      console.log(`Cancelled notification ${notificationId}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.notificationIds.clear();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Get notification title based on reminder type
   * @param {string} reminderType - Type of reminder
   */
  getNotificationTitle(reminderType) {
    switch (reminderType) {
      case 'due_date':
        return '⏰ Task Due Soon!';
      case 'due_soon':
        return '📅 Task Due Tomorrow';
      case 'overdue':
        return '🚨 Task Overdue!';
      default:
        return '📝 Task Reminder';
    }
  }

  /**
   * Get notification body based on task and reminder type
   * @param {Object} task - Task object
   * @param {string} reminderType - Type of reminder
   */
  getNotificationBody(task, reminderType) {
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toLocaleDateString();
    const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    switch (reminderType) {
      case 'due_date':
        return `"${task.text}" is due in 1 hour (${formattedTime})`;
      case 'due_soon':
        return `"${task.text}" is due tomorrow (${formattedDate})`;
      case 'overdue':
        return `"${task.text}" is now overdue!`;
      default:
        return `"${task.text}" is due ${formattedDate}`;
    }
  }

  /**
   * Schedule daily reminder to check tasks
   */
  async scheduleDailyReminder() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // 9 AM

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Good Morning!',
          body: 'Check your tasks for today and stay productive!',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      this.notificationIds.add(notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      return null;
    }
  }

  /**
   * Schedule weekly progress reminder
   */
  async scheduleWeeklyReminder() {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Weekly Review',
          body: 'Time to review your progress and plan for next week!',
          data: { type: 'weekly_reminder' },
        },
        trigger: {
          weekday: 1, // Monday
          hour: 10,
          minute: 0,
          repeats: true,
        },
      });

      this.notificationIds.add(notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling weekly reminder:', error);
      return null;
    }
  }

  /**
   * Initialize notification service
   */
  async initialize() {
    const hasPermission = await this.requestPermissions();
    
    if (hasPermission) {
      // Schedule recurring reminders
      await this.scheduleDailyReminder();
      await this.scheduleWeeklyReminder();
      
      console.log('Notification service initialized');
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export default new NotificationService();
