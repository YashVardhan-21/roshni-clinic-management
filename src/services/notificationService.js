// Notification management service
import supabaseService from './supabaseService';

class NotificationService {
  constructor() {
    this.client = supabaseService;
  }

  // Create in-app notification
  async createNotification(notificationData) {
    try {
      const result = await this.client.create('notifications', {
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        notification_type: notificationData.type || 'info',
        priority: notificationData.priority || 'normal',
        delivery_method: notificationData.delivery_method || ['in_app'],
        action_url: notificationData.action_url,
        related_id: notificationData.related_id,
        related_type: notificationData.related_type,
        scheduled_for: notificationData.scheduled_for
      });

      return result;
    } catch (error) {
      console.error('Create notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user notifications
  async getUserNotifications(userId, options = {}) {
    try {
      let query = this.client.client
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (options.unread_only) {
        query = query.eq('is_read', false);
      }

      if (options.type) {
        query = query.eq('notification_type', options.type);
      }

      query = query.order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const result = await this.client.update('notifications', notificationId, {
        is_read: true,
        read_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const { error } = await this.client.client
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment confirmation
  async sendAppointmentConfirmation(appointmentData) {
    try {
      // Create notification for patient
      await this.createNotification({
        user_id: appointmentData.patient_id,
        title: 'Appointment Confirmed',
        message: `Your appointment has been scheduled for ${appointmentData.appointment_date} at ${appointmentData.start_time}`,
        type: 'appointment',
        delivery_method: ['in_app', 'email'],
        related_id: appointmentData.appointment_id,
        related_type: 'appointment'
      });

      // Create notification for therapist
      await this.createNotification({
        user_id: appointmentData.therapist_user_id,
        title: 'New Appointment',
        message: `New appointment scheduled with ${appointmentData.patient_name} on ${appointmentData.appointment_date}`,
        type: 'appointment',
        delivery_method: ['in_app'],
        related_id: appointmentData.appointment_id,
        related_type: 'appointment'
      });

      return { success: true };
    } catch (error) {
      console.error('Send appointment confirmation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointmentData) {
    try {
      const result = await this.createNotification({
        user_id: appointmentData.patient_id,
        title: 'Appointment Reminder',
        message: `You have an appointment tomorrow at ${appointmentData.start_time} with your therapist.`,
        type: 'reminder',
        delivery_method: ['in_app', 'sms'],
        related_id: appointmentData.appointment_id,
        related_type: 'appointment',
        scheduled_for: appointmentData.reminder_time
      });

      return result;
    } catch (error) {
      console.error('Send appointment reminder error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send payment confirmation
  async sendPaymentConfirmation(paymentData) {
    try {
      const result = await this.createNotification({
        user_id: paymentData.patient_id,
        title: 'Payment Confirmed',
        message: `Your payment of ₹${paymentData.amount} has been successfully processed.`,
        type: 'payment',
        delivery_method: ['in_app', 'email'],
        related_id: paymentData.payment_id,
        related_type: 'payment'
      });

      return result;
    } catch (error) {
      console.error('Send payment confirmation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send exercise reminder
  async sendExerciseReminder(exerciseData) {
    try {
      const result = await this.createNotification({
        user_id: exerciseData.patient_id,
        title: 'Exercise Reminder',
        message: `Don't forget to complete your ${exerciseData.exercise_name} exercise today!`,
        type: 'exercise',
        delivery_method: ['in_app'],
        related_id: exerciseData.exercise_id,
        related_type: 'exercise'
      });

      return result;
    } catch (error) {
      console.error('Send exercise reminder error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send progress update
  async sendProgressUpdate(progressData) {
    try {
      const result = await this.createNotification({
        user_id: progressData.patient_id,
        title: 'Progress Update',
        message: `Great job! You've improved in ${progressData.metric_name} by ${progressData.improvement}%.`,
        type: 'success',
        delivery_method: ['in_app'],
        related_id: progressData.progress_id,
        related_type: 'progress'
      });

      return result;
    } catch (error) {
      console.error('Send progress update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get notification count
  async getUnreadCount(userId) {
    try {
      const { count, error } = await this.client.client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId, callback) {
    return this.client.subscribeToTable('notifications', (payload) => {
      if (payload.new && payload.new.user_id === userId) {
        callback(payload);
      }
    }, { user_id: userId });
  }

  // Schedule reminder notifications
  async scheduleReminders() {
    try {
      // Get appointments for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const { data: appointments, error } = await this.client.client
        .from('appointments')
        .select(`
          *,
          patient:user_profiles!patient_id(full_name, phone_number),
          therapist:therapist_profiles!therapist_id(
            user_profiles!user_id(full_name)
          )
        `)
        .eq('appointment_date', tomorrowStr)
        .eq('status', 'confirmed');

      if (error) throw error;

      // Send reminders for each appointment
      for (const appointment of appointments) {
        await this.sendAppointmentReminder({
          patient_id: appointment.patient_id,
          appointment_id: appointment.id,
          start_time: appointment.start_time,
          reminder_time: new Date(tomorrow.getTime() - 24 * 60 * 60 * 1000).toISOString()
        });
      }

      return { success: true, remindersSent: appointments.length };
    } catch (error) {
      console.error('Schedule reminders error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new NotificationService();
