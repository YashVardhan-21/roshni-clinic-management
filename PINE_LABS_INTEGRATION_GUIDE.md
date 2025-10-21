# Pine Labs QR Payment Integration Guide

## Overview

This guide explains how to integrate Pine Labs QR code payments into your Roshni Clinic Management System. The integration allows patients to make payments by scanning QR codes generated through Pine Labs payment gateway.

## Integration Architecture

```
Patient → Select Pine Labs QR → Generate QR Code → Scan & Pay → Payment Callback → Confirmation
```

## Prerequisites

### 1. Pine Labs Account Setup
- Contact Pine Labs sales team
- Complete merchant onboarding process
- Get merchant credentials:
  - Merchant ID
  - Access Code
  - Secure Secret

### 2. Required Configuration

Create a `.env` file in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Pine Labs Configuration
VITE_PINELABS_MERCHANT_ID=your_pinelabs_merchant_id
VITE_PINELABS_ACCESS_CODE=your_pinelabs_access_code
VITE_PINELABS_SECURE_SECRET=your_pinelabs_secure_secret
VITE_PINELABS_API_ENDPOINT=https://api.pinelabs.com

# Application Configuration
VITE_ENVIRONMENT=development
```

## Implementation Details

### 1. Pine Labs Service (`src/utils/pinelabsService.js`)

**Key Features:**
- QR code generation
- Payment verification
- Secure hash generation
- Development mode simulation

**Main Methods:**
- `generateQRCode(paymentData)` - Creates UPI QR code
- `verifyPayment(transactionId)` - Verifies payment status
- `generateOrderId()` - Creates unique order IDs

### 2. Enhanced Payment Component (`PaymentMethodSelector.jsx`)

**New Features:**
- Pine Labs QR payment option
- QR code display with instructions
- Loading states and error handling
- Regenerate QR functionality

### 3. Payment Callback Handler (`PaymentCallback.jsx`)

**Handles:**
- Payment success/failure responses
- Transaction verification
- User redirection based on status

## Setup Instructions

### Step 1: Contact Pine Labs

Send this email to your Pine Labs Account Manager:

```
Subject: Pine Labs Integration for Roshni Clinic Management System

Dear Pine Labs Account Manager,

We are integrating Pine Labs payment gateway for our clinic management system and require the following configuration:

1. Enable the Aggregator model for card and UPI transactions
2. Enable QR code generation APIs
3. Allow dynamic URL in redirection/return URL
4. Enable the INQUIRY API to check payment status
5. Configure callback URL: https://yourdomain.com/payment-callback

Please provide:
- Merchant ID
- Access Code
- Secure Secret
- API documentation for QR payments

Best regards,
Roshni Clinic Team
```

### Step 2: Environment Setup

1. Copy environment variables template to `.env`
2. Update with your Pine Labs credentials
3. Restart your development server

### Step 3: Test Integration

1. Navigate to appointment booking
2. Select "Pine Labs QR Payment"
3. Generate QR code (development mode shows demo QR)
4. Test the complete payment flow

## API Integration Details

### QR Code Generation Request

```javascript
const orderData = {
  merchant_id: 'YOUR_MERCHANT_ID',
  access_code: 'YOUR_ACCESS_CODE',
  order_id: 'RC_1234567890_123',
  amount: '800.00',
  currency: 'INR',
  redirect_url: 'https://yourdomain.com/payment-callback',
  payment_mode: 'QR',
  customer_identifier: 'patient_123',
  billing_name: 'Patient Name',
  billing_email: 'patient@email.com',
  billing_tel: '9876543210',
  merchant_param1: 'APT_1234567890',
  merchant_param2: 'roshni_clinic',
  language: 'EN'
};
```

### Payment Verification

```javascript
const verificationData = {
  merchant_id: 'YOUR_MERCHANT_ID',
  access_code: 'YOUR_ACCESS_CODE',
  order_id: 'transaction_id_from_response'
};
```

## Development vs Production

### Development Mode
- Uses simulated QR generation
- Shows demo QR codes via QR Server API
- No actual payment processing

### Production Mode
- Calls actual Pine Labs APIs
- Processes real payments
- Requires valid merchant credentials

## Security Considerations

1. **Environment Variables**: Store credentials securely
2. **HTTPS Only**: Use HTTPS in production
3. **Hash Verification**: Implement proper secure hash validation
4. **Server-Side Validation**: Verify payments server-side
5. **Callback Security**: Validate callback authenticity

## Error Handling

The integration handles:
- Network failures
- Invalid credentials
- QR generation failures
- Payment verification errors
- User cancellations

## Testing Checklist

- [ ] QR code generation works
- [ ] QR code displays properly
- [ ] Payment callback handling
- [ ] Success/failure flows
- [ ] Error states and messages
- [ ] Mobile responsiveness
- [ ] UPI app integration

## Support and Documentation

- [Pine Labs Developer Documentation](https://www.pinelabs.com/developer)
- [Razorpay Pine Labs Integration](https://razorpay.com/docs/payments/optimizer/pinelabs/)

## Troubleshooting

### Common Issues

1. **QR Code Not Generating**
   - Check merchant credentials
   - Verify API endpoint
   - Check network connectivity

2. **Payment Callback Not Working**
   - Verify callback URL configuration
   - Check URL whitelisting with Pine Labs
   - Ensure HTTPS in production

3. **Payment Verification Fails**
   - Check transaction ID format
   - Verify API credentials
   - Check INQUIRY API access

### Debug Mode

Set `VITE_ENVIRONMENT=development` to enable:
- Console logging
- Simulated responses
- Demo QR codes

## Next Steps

After successful integration:

1. Complete Pine Labs merchant verification
2. Test with small amounts in production
3. Configure webhook endpoints for automatic status updates
4. Implement payment reconciliation
5. Add payment analytics and reporting

## Contact

For technical support:
- Pine Labs Support: [Contact Pine Labs](https://www.pinelabs.com/contact)
- Internal Team: Update with your team contacts 