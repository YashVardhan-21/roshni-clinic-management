// Payment processing service
import supabaseService from './supabaseService';

class PaymentService {
  constructor() {
    this.client = supabaseService;
  }

  // Process UPI payment (FREE - no gateway needed)
  async processUPIPayment(paymentData) {
    try {
      // Generate UPI payment string
      const upiString = this.generateUPIString({
        merchantId: 'roshniclinic@upi',
        merchantName: 'Roshni Clinic',
        amount: paymentData.amount,
        transactionNote: `Payment for appointment ${paymentData.appointment_id}`,
        transactionRef: `RC_${Date.now()}`
      });

      // Generate QR code URL (FREE service)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;

      // Record payment as pending
      const result = await this.client.create('payments', {
        appointment_id: paymentData.appointment_id,
        patient_id: paymentData.patient_id,
        amount: paymentData.amount,
        payment_method: 'upi',
        gateway_payment_id: `UPI_${Date.now()}`,
        transaction_status: 'pending',
        notes: 'UPI QR Payment - Manual verification required'
      });

      if (result.success) {
        return {
          success: true,
          data: {
            paymentId: result.data.id,
            qrCodeUrl,
            upiString,
            status: 'pending',
            requiresManualVerification: true
          }
        };
      }

      return result;
    } catch (error) {
      console.error('UPI payment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Process Razorpay payment (FREE tier)
  async processRazorpayPayment(paymentData) {
    try {
      // Create Razorpay order
      const orderResult = await this.createRazorpayOrder({
        amount: paymentData.amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `RC_${paymentData.appointment_id}`,
        notes: {
          appointment_id: paymentData.appointment_id,
          patient_id: paymentData.patient_id
        }
      });

      if (!orderResult.success) {
        return orderResult;
      }

      // Record payment
      const paymentResult = await this.client.create('payments', {
        appointment_id: paymentData.appointment_id,
        patient_id: paymentData.patient_id,
        amount: paymentData.amount,
        payment_method: 'razorpay',
        payment_gateway: 'razorpay',
        gateway_order_id: orderResult.data.id,
        transaction_status: 'processing'
      });

      if (paymentResult.success) {
        return {
          success: true,
          data: {
            paymentId: paymentResult.data.id,
            orderId: orderResult.data.id,
            amount: paymentData.amount,
            currency: 'INR',
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            name: 'Roshni Clinic',
            description: `Payment for appointment ${paymentData.appointment_id}`,
            prefill: {
              name: paymentData.customerName,
              email: paymentData.customerEmail,
              contact: paymentData.customerPhone
            }
          }
        };
      }

      return paymentResult;
    } catch (error) {
      console.error('Razorpay payment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Record manual payment (cash/bank transfer)
  async recordManualPayment(paymentData) {
    try {
      const result = await this.client.create('payments', {
        appointment_id: paymentData.appointment_id,
        patient_id: paymentData.patient_id,
        amount: paymentData.amount,
        payment_method: paymentData.method,
        transaction_status: 'completed',
        processed_by: paymentData.processed_by,
        notes: paymentData.notes,
        receipt_number: paymentData.receipt_number
      });

      if (result.success) {
        // Update appointment payment status
        await this.client.update('appointments', paymentData.appointment_id, {
          payment_status: 'paid'
        });
      }

      return result;
    } catch (error) {
      console.error('Manual payment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify payment
  async verifyPayment(paymentId, paymentData) {
    try {
      // Update payment record
      const result = await this.client.update('payments', paymentId, {
        gateway_payment_id: paymentData.razorpay_payment_id,
        gateway_order_id: paymentData.razorpay_order_id,
        gateway_response: paymentData,
        transaction_status: 'completed'
      });

      if (result.success) {
        // Update appointment payment status
        const appointment = await this.client.read('payments', { id: paymentId });
        if (appointment.data && appointment.data[0]) {
          await this.client.update('appointments', appointment.data[0].appointment_id, {
            payment_status: 'paid'
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Verify payment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get payment history
  async getPaymentHistory(patientId, options = {}) {
    try {
      let query = this.client.client
        .from('payments')
        .select(`
          *,
          appointment:appointments!appointment_id(
            appointment_date,
            start_time,
            service:services!service_id(name)
          )
        `)
        .eq('patient_id', patientId);

      if (options.status) {
        query = query.eq('transaction_status', options.status);
      }

      query = query.order('transaction_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get payment history error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate payment receipt
  async generateReceipt(paymentId) {
    try {
      const { data, error } = await this.client.client
        .from('payments')
        .select(`
          *,
          appointment:appointments!appointment_id(
            appointment_date,
            start_time,
            patient:user_profiles!patient_id(full_name, email, phone_number),
            service:services!service_id(name)
          )
        `)
        .eq('id', paymentId)
        .single();

      if (error) throw error;

      const receipt = {
        receipt_number: data.payment_reference,
        date: data.transaction_date,
        amount: data.amount,
        method: data.payment_method,
        status: data.transaction_status,
        patient: data.appointment.patient,
        appointment: {
          date: data.appointment.appointment_date,
          time: data.appointment.start_time,
          service: data.appointment.service.name
        }
      };

      return { success: true, data: receipt };
    } catch (error) {
      console.error('Generate receipt error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper: Generate UPI string
  generateUPIString(data) {
    const { merchantId, merchantName, amount, transactionNote, transactionRef } = data;
    return `upi://pay?pa=${merchantId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`;
  }

  // Helper: Create Razorpay order (mock for demo)
  async createRazorpayOrder(orderData) {
    // In production, this would call Razorpay API
    // For demo, we'll simulate the response
    return {
      success: true,
      data: {
        id: `order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: 'created'
      }
    };
  }
}

export default new PaymentService();
