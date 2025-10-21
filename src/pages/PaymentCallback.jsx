import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import PineLabsService from '../utils/pinelabsService';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // Get payment parameters from URL
      const transactionId = searchParams.get('transaction_id');
      const orderId = searchParams.get('order_id');
      const status = searchParams.get('order_status');
      const amount = searchParams.get('amount');

      if (!transactionId) {
        setError('Invalid payment response');
        setPaymentStatus('failed');
        return;
      }

      // Verify payment with Pine Labs
      const verificationResult = await PineLabsService.verifyPayment(transactionId);

      if (verificationResult.success) {
        if (verificationResult.status === 'Success' || status === 'Success') {
          setPaymentStatus('success');
          setPaymentData({
            transactionId,
            orderId,
            amount: amount || verificationResult.amount,
            paymentMode: verificationResult.paymentMode || 'QR'
          });

          // Here you would typically:
          // 1. Update appointment status in database
          // 2. Send confirmation email/SMS
          // 3. Update patient records

        } else if (verificationResult.status === 'Aborted' || status === 'Aborted') {
          setPaymentStatus('cancelled');
        } else {
          setPaymentStatus('failed');
          setError('Payment verification failed');
        }
      } else {
        setPaymentStatus('failed');
        setError(verificationResult.error || 'Payment verification failed');
      }

    } catch (error) {
      console.error('Payment callback error:', error);
      setPaymentStatus('failed');
      setError('An error occurred while processing your payment');
    }
  };

  const handleReturnToBooking = () => {
    navigate('/appointment-booking');
  };

  const handleGoToDashboard = () => {
    navigate('/patient-dashboard');
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="text-center space-y-4">
            <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin" />
            <h2 className="font-heading font-semibold text-xl text-foreground">
              Processing Payment...
            </h2>
            <p className="font-body text-muted-foreground">
              Please wait while we verify your payment
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-2xl text-foreground">
                Payment Successful!
              </h2>
              <p className="font-body text-muted-foreground">
                Your appointment has been confirmed
              </p>
            </div>

            {paymentData && (
              <div className="bg-muted rounded-therapeutic p-4 space-y-3 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-sm text-foreground">{paymentData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm text-foreground">{paymentData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Amount Paid:</span>
                  <span className="font-mono text-sm text-foreground">₹{paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Payment Method:</span>
                  <span className="font-body text-sm text-foreground">Pine Labs {paymentData.paymentMode}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleReturnToBooking}
                className="flex items-center space-x-2"
              >
                <Icon name="Calendar" size={16} />
                <span>Book Another Appointment</span>
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleGoToDashboard}
                className="flex items-center space-x-2"
              >
                <Icon name="Home" size={16} />
                <span>Go to Dashboard</span>
              </Button>
            </div>
          </div>
        );

      case 'cancelled':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <Icon name="XCircle" size={32} className="text-orange-600" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-2xl text-foreground">
                Payment Cancelled
              </h2>
              <p className="font-body text-muted-foreground">
                Your payment was cancelled. No amount has been charged.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToDashboard}
                className="flex items-center space-x-2"
              >
                <Icon name="Home" size={16} />
                <span>Go to Dashboard</span>
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleReturnToBooking}
                className="flex items-center space-x-2"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Try Again</span>
              </Button>
            </div>
          </div>
        );

      case 'failed':
      default:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={32} className="text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-2xl text-foreground">
                Payment Failed
              </h2>
              <p className="font-body text-muted-foreground">
                {error || 'There was an issue processing your payment'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToDashboard}
                className="flex items-center space-x-2"
              >
                <Icon name="Home" size={16} />
                <span>Go to Dashboard</span>
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleReturnToBooking}
                className="flex items-center space-x-2"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Try Again</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-therapeutic border border-border p-8">
        {renderPaymentStatus()}
      </div>
    </div>
  );
};

export default PaymentCallback; 