// Pine Labs Payment Service for QR Code Integration
// This service handles Pine Labs payment integration for Roshni Clinic

const PINELABS_CONFIG = {
  // These will be provided by Pine Labs after account setup
  merchantId: import.meta.env.VITE_PINELABS_MERCHANT_ID || '',
  accessCode: import.meta.env.VITE_PINELABS_ACCESS_CODE || '',
  secureSecret: import.meta.env.VITE_PINELABS_SECURE_SECRET || '',
  apiEndpoint: import.meta.env.VITE_PINELABS_API_ENDPOINT || 'https://api.pinelabs.com',
  redirectUrl: `${window.location.origin}/payment-callback`
};

class PineLabsService {
  constructor() {
    this.isProduction = import.meta.env.MODE === 'production';
  }

  /**
   * Generate QR Code for Pine Labs Payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} QR code response
   */
  async generateQRCode(paymentData) {
    try {
      const orderData = {
        merchant_id: PINELABS_CONFIG.merchantId,
        access_code: PINELABS_CONFIG.accessCode,
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        currency: 'INR',
        redirect_url: PINELABS_CONFIG.redirectUrl,
        cancel_url: PINELABS_CONFIG.redirectUrl,
        payment_mode: 'QR',
        customer_identifier: paymentData.customerId || '',
        billing_name: paymentData.customerName || '',
        billing_email: paymentData.customerEmail || '',
        billing_tel: paymentData.customerPhone || '',
        delivery_name: paymentData.customerName || '',
        delivery_tel: paymentData.customerPhone || '',
        merchant_param1: paymentData.appointmentId || '',
        merchant_param2: 'roshni_clinic',
        merchant_param3: paymentData.serviceType || '',
        language: 'EN'
      };

      // Generate secure hash (this would be done server-side in production)
      const secureHash = this.generateSecureHash(orderData);
      orderData.secure_hash = secureHash;

      // For demo purposes, we'll simulate QR generation
      // In production, this would call Pine Labs API
      if (!this.isProduction) {
        return this.simulateQRGeneration(orderData);
      }

      const response = await fetch(`${PINELABS_CONFIG.apiEndpoint}/v1/qr/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINELABS_CONFIG.accessCode}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Pine Labs API Error: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'SUCCESS') {
        return {
          success: true,
          qrCode: result.qr_code_url,
          transactionId: result.transaction_id,
          orderId: result.order_id
        };
      } else {
        throw new Error(result.message || 'QR generation failed');
      }

    } catch (error) {
      console.error('Pine Labs QR generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate QR code'
      };
    }
  }

  /**
   * Verify payment status
   * @param {string} transactionId - Transaction ID from Pine Labs
   * @returns {Promise<Object>} Payment status
   */
  async verifyPayment(transactionId) {
    try {
      const verificationData = {
        merchant_id: PINELABS_CONFIG.merchantId,
        access_code: PINELABS_CONFIG.accessCode,
        order_id: transactionId
      };

      const response = await fetch(`${PINELABS_CONFIG.apiEndpoint}/v1/transaction/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINELABS_CONFIG.accessCode}`
        },
        body: JSON.stringify(verificationData)
      });

      const result = await response.json();
      
      return {
        success: true,
        status: result.order_status,
        amount: result.amount,
        transactionId: result.reference_no,
        paymentMode: result.payment_mode
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate secure hash for Pine Labs API
   * @param {Object} data - Payment data
   * @returns {string} Secure hash
   */
  generateSecureHash(data) {
    // This is a simplified hash generation
    // In production, use Pine Labs recommended hash algorithm
    const hashString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&') + PINELABS_CONFIG.secureSecret;
    
    // For demo, return a mock hash
    return btoa(hashString).substring(0, 32);
  }

  /**
   * Simulate QR generation for development
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Simulated response
   */
  async simulateQRGeneration(orderData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a mock QR code URL
    const qrData = `upi://pay?pa=merchant@pinelabs&pn=Roshni Clinic&am=${orderData.amount}&cu=INR&tn=Payment for ${orderData.merchant_param1}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    return {
      success: true,
      qrCode: qrCodeUrl,
      transactionId: `TXN${Date.now()}`,
      orderId: orderData.order_id
    };
  }

  /**
   * Generate unique order ID
   * @returns {string} Unique order ID
   */
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RC_${timestamp}_${random}`;
  }
}

export default new PineLabsService(); 