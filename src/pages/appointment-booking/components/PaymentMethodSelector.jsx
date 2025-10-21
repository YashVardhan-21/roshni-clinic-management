import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import PineLabsService from '../../../utils/pinelabsService';

const PaymentMethodSelector = ({ totalAmount, onPaymentSelect, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [errors, setErrors] = useState({});
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, RuPay accepted',
      processingFee: 0
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: 'Smartphone',
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      processingFee: 0
    },
    {
      id: 'pinelabs-qr',
      name: 'Pine Labs QR Payment',
      icon: 'QrCode',
      description: 'Scan QR code at clinic counter',
      processingFee: 0
    },
    {
      id: 'pay-at-clinic',
      name: 'Pay at Clinic',
      icon: 'MapPin',
      description: 'Cash or card payment at the clinic',
      processingFee: 0
    }
  ];

  const handleMethodSelect = async (methodId) => {
    setSelectedMethod(methodId);
    setErrors({});
    
    // Generate QR code when Pine Labs QR is selected
    if (methodId === 'pinelabs-qr') {
      await generatePineLabsQR();
    }
  };

  const generatePineLabsQR = async () => {
    setQrCodeLoading(true);
    setQrCodeData(null);
    
    try {
      const paymentData = {
        orderId: PineLabsService.generateOrderId(),
        amount: totalAmount,
        customerId: 'patient_123', // This should come from user context
        customerName: 'Patient Name', // This should come from form data
        customerEmail: 'patient@email.com', // This should come from form data
        customerPhone: '9876543210', // This should come from form data
        appointmentId: 'APT_' + Date.now(),
        serviceType: 'Physiotherapy' // This should come from booking data
      };

      const result = await PineLabsService.generateQRCode(paymentData);
      
      if (result.success) {
        setQrCodeData(result.qrCode);
      } else {
        setErrors({ qr: result.error });
      }
    } catch (error) {
      setErrors({ qr: 'Failed to generate QR code. Please try again.' });
    } finally {
      setQrCodeLoading(false);
    }
  };

  const validateCardDetails = () => {
    const newErrors = {};
    
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardDetails.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter valid expiry date (MM/YY)';
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter valid CVV';
    }
    
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }
    
    return newErrors;
  };

  const validateUPI = () => {
    const newErrors = {};
    
    if (!upiId || !upiId.includes('@')) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }
    
    return newErrors;
  };

  const handlePaymentSubmit = () => {
    let validationErrors = {};
    
    if (selectedMethod === 'card') {
      validationErrors = validateCardDetails();
    } else if (selectedMethod === 'upi') {
      validationErrors = validateUPI();
    } else if (selectedMethod === 'pinelabs-qr' && !qrCodeData) {
      validationErrors = { qr: 'QR code not generated. Please try again.' };
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const paymentData = {
      method: selectedMethod,
      amount: totalAmount,
      ...(selectedMethod === 'card' && { cardDetails }),
      ...(selectedMethod === 'upi' && { upiId }),
      ...(selectedMethod === 'pinelabs-qr' && { qrCodeData }),
      savePaymentMethod
    };
    
    onPaymentSelect(paymentData);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Payment Method
        </h3>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span className="font-body text-sm">Secure Payment</span>
        </div>
      </div>
      
      {/* Payment Amount Summary */}
      <div className="p-4 bg-muted rounded-therapeutic mb-6">
        <div className="flex justify-between items-center">
          <span className="font-body text-base text-foreground">
            Total Amount to Pay
          </span>
          <span className="font-mono font-bold text-xl text-primary">
            ₹{totalAmount}
          </span>
        </div>
      </div>
      
      {/* Payment Method Options */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-therapeutic border-2 cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-gentle ${
                selectedMethod === method.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={method.icon} size={20} />
              </div>
              
              <div className="flex-1">
                <h4 className="font-body font-medium text-base text-foreground">
                  {method.name}
                </h4>
                <p className="font-caption text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {method.processingFee === 0 && (
                  <span className="px-2 py-1 bg-success/10 text-success rounded-gentle font-caption text-xs">
                    No Fee
                  </span>
                )}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary' :'border-border'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Payment Details Forms */}
      {selectedMethod === 'card' && (
        <div className="space-y-4 p-4 bg-muted rounded-therapeutic mb-6">
          <h4 className="font-heading font-medium text-base text-foreground mb-4">
            Card Details
          </h4>
          
          <Input
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails(prev => ({
              ...prev,
              cardNumber: formatCardNumber(e.target.value)
            }))}
            error={errors.cardNumber}
            maxLength="19"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                expiryDate: formatExpiryDate(e.target.value)
              }))}
              error={errors.expiryDate}
              maxLength="5"
            />
            
            <Input
              label="CVV"
              type="password"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                cvv: e.target.value.replace(/\D/g, '')
              }))}
              error={errors.cvv}
              maxLength="4"
            />
          </div>
          
          <Input
            label="Cardholder Name"
            type="text"
            placeholder="Name as on card"
            value={cardDetails.cardholderName}
            onChange={(e) => setCardDetails(prev => ({
              ...prev,
              cardholderName: e.target.value.toUpperCase()
            }))}
            error={errors.cardholderName}
          />
        </div>
      )}
      
      {selectedMethod === 'upi' && (
        <div className="space-y-4 p-4 bg-muted rounded-therapeutic mb-6">
          <h4 className="font-heading font-medium text-base text-foreground mb-4">
            UPI Details
          </h4>
          
          <Input
            label="UPI ID"
            type="text"
            placeholder="yourname@paytm"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            error={errors.upiId}
            description="Enter your UPI ID from any UPI app"
          />
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <Icon name="Smartphone" size={16} />
            <span className="font-caption text-sm">
              You'll be redirected to your UPI app to complete the payment
            </span>
          </div>
        </div>
      )}
      
             {selectedMethod === 'pinelabs-qr' && (
         <div className="space-y-4 p-4 bg-muted rounded-therapeutic mb-6">
           <h4 className="font-heading font-medium text-base text-foreground mb-4">
             Pine Labs QR Payment
           </h4>
           
           {errors.qr && (
             <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-therapeutic">
               <div className="flex items-center space-x-2">
                 <Icon name="AlertCircle" size={16} className="text-destructive" />
                 <p className="font-caption text-sm text-destructive">{errors.qr}</p>
               </div>
             </div>
           )}
           
           {qrCodeLoading ? (
             <div className="flex flex-col justify-center items-center h-48 space-y-3">
               <Icon name="Loader2" size={32} className="animate-spin text-primary" />
               <p className="font-caption text-sm text-muted-foreground">
                 Generating QR code...
               </p>
             </div>
           ) : qrCodeData ? (
             <div className="flex flex-col items-center justify-center space-y-4">
               <div className="p-4 bg-white rounded-therapeutic border-2 border-border">
                 <img 
                   src={qrCodeData} 
                   alt="Pine Labs QR Code" 
                   className="w-48 h-48 object-contain"
                 />
               </div>
               <div className="text-center space-y-2">
                 <p className="font-body font-medium text-base text-foreground">
                   Scan QR Code to Pay ₹{totalAmount}
                 </p>
                 <p className="font-caption text-sm text-muted-foreground">
                   Use any UPI app to scan and complete the payment
                 </p>
               </div>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={generatePineLabsQR}
                 className="flex items-center space-x-2"
               >
                 <Icon name="RefreshCw" size={16} />
                 <span>Regenerate QR Code</span>
               </Button>
             </div>
           ) : (
             <div className="text-center space-y-3">
               <Icon name="QrCode" size={48} className="mx-auto text-muted-foreground" />
               <p className="font-caption text-sm text-muted-foreground">
                 Click "Generate QR Code" to create a payment QR code
               </p>
               <Button
                 type="button"
                 variant="outline"
                 onClick={generatePineLabsQR}
                 className="flex items-center space-x-2"
               >
                 <Icon name="QrCode" size={16} />
                 <span>Generate QR Code</span>
               </Button>
             </div>
           )}
           
           <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-therapeutic">
             <div className="flex items-start space-x-2">
               <Icon name="Info" size={16} className="text-primary mt-0.5" />
               <div className="space-y-1">
                 <p className="font-body font-medium text-sm text-primary">
                   Pine Labs QR Payment Instructions:
                 </p>
                 <ul className="font-caption text-xs text-muted-foreground space-y-1">
                   <li>• Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
                   <li>• Scan the QR code displayed above</li>
                   <li>• Verify the amount and merchant details</li>
                   <li>• Complete the payment using your UPI PIN</li>
                   <li>• Payment confirmation will be instant</li>
                 </ul>
               </div>
             </div>
           </div>
         </div>
       )}
      
      {selectedMethod === 'pay-at-clinic' && (
        <div className="p-4 bg-muted rounded-therapeutic mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-base text-foreground mb-2">
                Pay at Clinic Information
              </h4>
              <ul className="font-caption text-sm text-muted-foreground space-y-1">
                <li>• Payment can be made in cash or by card at the clinic</li>
                <li>• Please arrive 10 minutes early for payment processing</li>
                <li>• Receipt will be provided after payment</li>
                <li>• Appointment will be confirmed upon payment</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Payment Method */}
      {(selectedMethod === 'card' || selectedMethod === 'upi') && (
        <div className="mb-6">
          <Checkbox
            label="Save this payment method for future bookings"
            checked={savePaymentMethod}
            onChange={(e) => setSavePaymentMethod(e.target.checked)}
            description="Your payment details will be securely encrypted and stored"
          />
        </div>
      )}
      
      {/* Security Information */}
      <div className="p-4 bg-success/5 border border-success/20 rounded-therapeutic mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-success mt-0.5" />
          <div>
            <h4 className="font-body font-medium text-sm text-success mb-1">
              Secure Payment
            </h4>
            <p className="font-caption text-xs text-muted-foreground">
              Your payment information is encrypted with 256-bit SSL security. 
              We never store your complete card details.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="sm:w-auto"
        >
          <Icon name="ArrowLeft" size={16} />
          Back to Patient Info
        </Button>
        
        <Button
          type="button"
          variant="default"
          onClick={handlePaymentSubmit}
          disabled={!selectedMethod}
          className="sm:flex-1"
        >
          <Icon name="CreditCard" size={16} />
          {selectedMethod === 'pay-at-clinic' ? 'Confirm Booking' : 'Proceed to Pay'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;