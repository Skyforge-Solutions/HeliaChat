import React, { useState } from 'react';
import { FiCreditCard, FiCheck, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';

const creditPackages = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 100,
    price: 9.99,
    popular: false,
    features: [
      'Access to standard models',
      '100 message credits',
      'Email support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 500,
    price: 29.99,
    popular: true,
    features: [
      'Access to all models',
      '500 message credits',
      'Priority support',
      'Image generation (10 included)'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    credits: 2000,
    price: 99.99,
    popular: false,
    features: [
      'Access to all models',
      '2000 message credits',
      'Priority support',
      'Image generation (50 included)',
      'API access'
    ]
  }
];

export default function BuyCreditsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { credits, addCredits } = useCredits();

  const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage);

  const handleContinueToPayment = () => {
    setCurrentStep(2);
  };

  const handleBackToPackages = () => {
    setCurrentStep(1);
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add credits to user account
      addCredits(selectedPkg.credits);
      
      setSuccess(true);
      // Reset after showing success message
      setTimeout(() => {
        setSuccess(false);
        setCurrentStep(1);
      }, 3000);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='min-h-screen bg-background text-foreground pt-20'>
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='text-center mb-8'>
          <img src={logo} alt='HeliaChat Logo' className='h-12 mx-auto mb-4' />
          <h1 className='text-3xl font-bold'>Buy Credits</h1>
          <p className='text-muted-foreground mt-2 max-w-xl mx-auto'>
            Purchase credits to continue your conversations with Helia.
          </p>
        </div>

        {/* Progress steps */}
        <div className='max-w-md mx-auto mb-10'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col items-center'>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className='text-sm mt-2'>Select Package</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className='flex flex-col items-center'>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className='text-sm mt-2'>Payment</span>
            </div>
          </div>
        </div>

        {/* Current balance */}
        <div className='bg-card border border-border rounded-lg p-6 mb-10 max-w-md mx-auto'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-lg font-medium'>Current Balance</h2>
              <p className='text-muted-foreground text-sm'>Available credits</p>
            </div>
            <div className='text-right'>
              <span className='text-3xl font-bold text-primary'>{credits}</span>
              <p className='text-sm text-muted-foreground'>credits</p>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* Credit packages */}
            <div className='grid md:grid-cols-3 gap-6 mb-8'>
              {creditPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`bg-card border rounded-xl overflow-hidden transition-all cursor-pointer ${
                    selectedPackage === pkg.id 
                      ? 'border-primary shadow-md scale-105 z-10' 
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  {pkg.popular && (
                    <div className='bg-primary text-primary-foreground text-center py-1 text-sm font-medium'>
                      Most Popular
                    </div>
                  )}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold'>{pkg.name}</h3>
                    <div className='mt-2 mb-4'>
                      <span className='text-3xl font-bold'>${pkg.price}</span>
                    </div>
                    <p className='text-primary font-medium mb-4'>{pkg.credits} credits</p>
                    <ul className='space-y-2 mb-6'>
                      {pkg.features.map((feature, index) => (
                        <li key={index} className='flex items-center'>
                          <FiCheck className='text-green-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`w-full py-2 px-4 rounded-md font-medium text-center transition-colors ${
                        selectedPackage === pkg.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {selectedPackage === pkg.id ? 'Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-center mt-8'>
              <button
                onClick={handleContinueToPayment}
                className='flex items-center justify-center py-3 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              >
                Continue to Payment <FiArrowRight className='ml-2' />
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className='max-w-md mx-auto bg-card border border-border rounded-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
              <button
                onClick={handleBackToPackages}
                className='text-sm text-muted-foreground hover:text-foreground flex items-center'
              >
                <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                Back
              </button>
              <div className='text-right'>
                <h3 className='font-medium'>{selectedPkg.name} Package</h3>
                <p className='text-primary font-bold'>${selectedPkg.price}</p>
              </div>
            </div>
            
            <h2 className='text-xl font-bold mb-4'>Payment Details</h2>
            
            {error && (
              <div className='bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded flex items-center mb-4'>
                <FiAlertCircle className='mr-2' />
                {error}
              </div>
            )}
            
            {success && (
              <div className='bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded flex items-center mb-4'>
                <FiCheck className='mr-2' />
                Payment successful! Your credits have been added to your account.
              </div>
            )}
            
            <form onSubmit={handlePurchase} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Payment Method</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    <FiCreditCard className='mr-2' />
                    Credit Card
                  </button>
                  <button
                    type='button'
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      paymentMethod === 'paypal'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    <svg className='w-4 h-4 mr-2' viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.11 0-.217.022-.316.058l-.956 6.058h3.458c.327 0 .605-.24.657-.563l.027-.126.55-3.523.035-.192a.66.66 0 0 1 .657-.563h.416c2.677 0 4.773-.548 5.383-2.127.255-.656.302-1.208.095-1.685a2.376 2.376 0 0 0-.356-.693z" />
                      <path d="M20.382 7.125c-.98 5.053-4.347 6.797-8.647 6.797h-2.19c-.524 0-.968.383-1.05.901l-1.12 7.106-.318 2.016a.635.635 0 0 0 .634.738h4.461c.528 0 .978-.386 1.06-.904l.044-.235.842-5.352.054-.293a.64.64 0 0 1 .632-.547h.39c2.58 0 4.597-.53 5.191-2.063.25-.646.29-1.194.085-1.66a2.16 2.16 0 0 0-.68-1.007 3.12 3.12 0 0 0-.388-.297z" />
                    </svg>
                    PayPal
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label htmlFor="card-number" className='block text-sm font-medium mb-1'>
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className='w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>
                  
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor="expiry" className='block text-sm font-medium mb-1'>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        className='w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className='block text-sm font-medium mb-1'>
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        className='w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className='pt-4'>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className='w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center'
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Complete Purchase - $${selectedPkg.price}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className='text-center mt-8 text-sm text-muted-foreground'>
          <p>Need help? Contact our support team at support@heliachat.com</p>
        </div>
      </div>
    </div>
  );
}
