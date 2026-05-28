import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
const Dashboard = () => {
  const navigate = useNavigate();
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();
  const [currentView, setCurrentView] = useState('home'); // home, drops, cart, orders, settings, editor, profile
  // Integrated Checkout Wizard states
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Details, 2 = Address, 3 = Success
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [checkoutSubmitError, setCheckoutSubmitError] = useState('');
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  // Checkout Step 1: Profile form state
  const [profileForm, setProfileForm] = useState({
    clerk_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: ''
  });
  // Checkout Step 2: Address form state
  const [addressForm, setAddressForm] = useState({
    user_id: '',
    recipient_name: '',
    recipient_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    address_type: 'Home',
    is_default_shipping: true,
    is_default_billing: true
  });
  // Sync Clerk details to Profile Form
  useEffect(() => {
    if (isClerkLoaded && isClerkSignedIn && clerkUser) {
      setProfileForm(prev => ({
        ...prev,
        clerk_id: clerkUser.id || '',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        email: clerkUser.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [clerkUser, isClerkLoaded, isClerkSignedIn]);
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (checkoutErrors[name]) {
      setCheckoutErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setAddressForm(prev => ({ ...prev, [name]: val }));
    if (checkoutErrors[name]) {
      setCheckoutErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const handleProfilePhoneChange = (e) => {
    const val = e.target.value;
    const cleanVal = val.replace(/[^\d+]/g, '');
    if (cleanVal.length <= 12) {
      setProfileForm(prev => ({ ...prev, phone_number: cleanVal }));
      if (checkoutErrors.phone_number) {
        setCheckoutErrors(prev => ({ ...prev, phone_number: '' }));
      }
    }
  };
  const handleAddressPhoneChange = (e) => {
    const val = e.target.value;
    const cleanVal = val.replace(/[^\d+]/g, '');
    if (cleanVal.length <= 12) {
      setAddressForm(prev => ({ ...prev, recipient_phone: cleanVal }));
      if (checkoutErrors.recipient_phone) {
        setCheckoutErrors(prev => ({ ...prev, recipient_phone: '' }));
      }
    }
  };
  const handleAddressPincodeChange = (e) => {
    const val = e.target.value;
    const cleanVal = val.replace(/[^\d]/g, '');
    if (cleanVal.length <= 6) {
      setAddressForm(prev => ({ ...prev, postal_code: cleanVal }));
      if (checkoutErrors.postal_code) {
        setCheckoutErrors(prev => ({ ...prev, postal_code: '' }));
      }
    }
  };
  const handleProfileGenderSelect = (genderVal) => {
    setProfileForm(prev => ({ ...prev, gender: genderVal }));
    if (checkoutErrors.gender) {
      setCheckoutErrors(prev => ({ ...prev, gender: '' }));
    }
  };
  const validateProfile = () => {
    const errs = {};
    if (!profileForm.clerk_id.trim()) errs.clerk_id = 'Clerk ID is required.';
    if (!profileForm.first_name.trim()) {
      errs.first_name = 'First name is required.';
    } else if (profileForm.first_name.trim().length < 3) {
      errs.first_name = 'Must be at least 3 characters.';
    }
    if (!profileForm.email.trim()) {
      errs.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileForm.email)) {
        errs.email = 'Please enter a valid email address.';
      } else if (!profileForm.email.toLowerCase().endsWith('@gmail.com')) {
        errs.email = 'Email must end with @gmail.com.';
      }
    }
    if (!profileForm.phone_number.trim()) {
      errs.phone_number = 'Phone number is required.';
    } else if (profileForm.phone_number.length > 12) {
      errs.phone_number = 'Phone number cannot exceed 12 characters.';
    }
    if (!profileForm.date_of_birth) {
      errs.date_of_birth = 'Date of birth is required.';
    } else if (isNaN(Date.parse(profileForm.date_of_birth))) {
      errs.date_of_birth = 'Invalid date.';
    }
    if (!profileForm.gender) {
      errs.gender = 'Gender is required.';
    }
    setCheckoutErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validateAddress = () => {
    const errs = {};
    if (!addressForm.recipient_name.trim()) {
      errs.recipient_name = 'Recipient name is required.';
    } else if (addressForm.recipient_name.trim().length < 3) {
      errs.recipient_name = 'Name must be at least 3 characters.';
    } else if (!/^[A-Za-z ]+$/.test(addressForm.recipient_name)) {
      errs.recipient_name = 'Letters and spaces only.';
    }
    if (!addressForm.recipient_phone.trim()) {
      errs.recipient_phone = 'Recipient phone is required.';
    } else if (addressForm.recipient_phone.length > 12) {
      errs.recipient_phone = 'Phone cannot exceed 12 characters.';
    }
    if (!addressForm.address_line1.trim()) {
      errs.address_line1 = 'Address line 1 is required.';
    } else if (addressForm.address_line1.trim().length < 3) {
      errs.address_line1 = 'Address must be at least 3 characters.';
    }
    if (!addressForm.city.trim()) {
      errs.city = 'City is required.';
    } else if (addressForm.city.trim().length < 3) {
      errs.city = 'City must be at least 3 characters.';
    }
    if (!addressForm.state.trim()) {
      errs.state = 'State is required.';
    } else if (addressForm.state.trim().length < 3) {
      errs.state = 'State must be at least 3 characters.';
    }
    if (!addressForm.postal_code.trim()) {
      errs.postal_code = 'Pincode is required.';
    } else if (addressForm.postal_code.length !== 6) {
      errs.postal_code = 'Pincode must be exactly 6 digits.';
    } else if (!/^[0-9]+$/.test(addressForm.postal_code)) {
      errs.postal_code = 'Numbers only.';
    }
    if (!addressForm.country.trim()) {
      errs.country = 'Country is required.';
    } else if (addressForm.country.trim().length < 3) {
      errs.country = 'Country must be at least 3 characters.';
    }
    setCheckoutErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setCheckoutSubmitError('');
    if (!validateProfile()) return;
    setIsCheckoutSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const apiErrors = {};
          Object.keys(data.errors).forEach(key => {
            apiErrors[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          });
          setCheckoutErrors(apiErrors);
          throw new Error(data.message || 'Validation failed on server.');
        } else {
          throw new Error(data.message || 'Failed to save profile.');
        }
      }
      setAddressForm(prev => ({
        ...prev,
        user_id: data.id,
        recipient_name: `${profileForm.first_name} ${profileForm.last_name || ''}`.trim(),
        recipient_phone: profileForm.phone_number
      }));
      setCheckoutStep(2);
    } catch (err) {
      setCheckoutSubmitError(err.message || 'Connection failed.');
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setCheckoutSubmitError('');
    if (!validateAddress()) return;
    setIsCheckoutSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/saveAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const apiErrors = {};
          Object.keys(data.errors).forEach(key => {
            apiErrors[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          });
          setCheckoutErrors(apiErrors);
          throw new Error(data.message || 'Validation failed on server.');
        } else {
          throw new Error(data.message || 'Failed to save address.');
        }
      }
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(`IDST-${randomNum}`);
      setCheckoutStep(3);
    } catch (err) {
      setCheckoutSubmitError(err.message || 'Connection failed.');
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
    </div>
  );
  const renderCartView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-50">Your Cart</h2>
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-50 px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:bg-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-50 mb-4"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p className="text-lg">Your cart is empty.</p>
  const renderCartView = () => {
    const handleCheckoutClick = () => {
      setIsCheckoutActive(true);
      setCheckoutStep(1);
    };
    const handleBackToCart = () => {
      setIsCheckoutActive(false);
      setCheckoutStep(1);
    };
    const handleOrderCompleted = () => {
      setCartItems([]); // Empty the cart
      setIsCheckoutActive(false);
      setCheckoutStep(1);
      setOrderTab('present');
      setCurrentView('orders'); // Redirect to orders view
    };
    return (
      <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-50">
            {isCheckoutActive ? 'Checkout & Place Order' : 'Your Cart'}
          </h2>
          <button 
            onClick={isCheckoutActive ? handleBackToCart : () => setCurrentView('home')} 
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-50 px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {isCheckoutActive ? 'Back to Cart' : 'Back'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {cartItems.map((item, idx) => (
             <div key={idx} className="group bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                <div className="w-full h-[250px] overflow-hidden relative" style={{ backgroundColor: item.color !== 'transparent' ? item.color : '#f1f5f9' }}>
                  <img src={item.frontImage} alt="Custom Design" className="w-full h-full object-cover mix-blend-multiply" />
                  <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%]">
                      <img src={item.designImage} className="max-w-full" alt="Design overlay" />
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-50 mb-4">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p className="text-lg">Your cart is empty.</p>
          </div>
        ) : !isCheckoutActive ? (
          // Standard Cart Items List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {cartItems.map((item, idx) => (
               <div key={idx} className="group bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                  <div className="w-full h-[250px] overflow-hidden relative" style={{ backgroundColor: item.color !== 'transparent' ? item.color : '#f1f5f9' }}>
                    <img src={item.frontImage} alt="Custom Design" className="w-full h-full object-cover mix-blend-multiply" />
                    <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%]">
                        <img src={item.designImage} className="max-w-full" alt="Design overlay" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-50 mb-1">Custom {item.garment.charAt(0).toUpperCase() + item.garment.slice(1)} ({item.size})</h3>
                    <p className="text-sm text-slate-400">Added {item.timestamp}</p>
                    <button onClick={handleCheckoutClick} className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer">Place Order</button>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          // Split Layout: Cart Items on Left, Checkout Form on Right
          <div className="flex flex-col lg:flex-row gap-8 w-full items-start pb-16">
            
            {/* Left side: Compact Cart Items Summary */}
            <div className="w-full lg:w-[350px] bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-100 border-b border-slate-850 pb-2">Order Summary</h3>
              <div className="flex flex-col gap-4 divide-y divide-slate-850 max-h-[350px] overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className={`flex gap-4 ${idx > 0 ? 'pt-4' : ''}`}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative" style={{ backgroundColor: item.color !== 'transparent' ? item.color : '#f1f5f9' }}>
                      <img src={item.frontImage} alt="Item" className="w-full h-full object-cover mix-blend-multiply" />
                      <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40%]">
                          <img src={item.designImage} className="max-w-full" alt="Design" />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-slate-200 truncate">Custom {item.garment}</span>
                      <span className="text-[11px] text-slate-400">Size: {item.size} | Color: {item.color === 'transparent' ? 'White' : 'Custom'}</span>
                      <span className="text-xs text-violet-400 mt-1 font-semibold">$35.00</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-850 pt-4 flex justify-between items-center text-sm font-semibold text-slate-200">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
            </div>
            {/* Right side: Checkout Wizard Panel */}
            <div className="flex-grow w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8">
              
              {/* Wizard Step 1: Customer Details */}
              {checkoutStep === 1 && (
                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                  <div className="border-b border-slate-850 pb-4">
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                      <span>Step 1 of 2</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                      <span className="text-slate-500">Profile Details</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-100">Customer Details</h3>
                    <p className="text-sm text-slate-400">Verify your details below to proceed.</p>
                  </div>
                  {checkoutSubmitError && (
                    <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex items-start gap-2.5">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <div>
                        <p className="font-bold">Error saving details</p>
                        <p>{checkoutSubmitError}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-300">Clerk ID</label>
                      {isClerkSignedIn && <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Sync Active</span>}
                    </div>
                    <input type="text" name="clerk_id" value={profileForm.clerk_id} onChange={handleProfileFormChange} placeholder="e.g. user_clerk..." className={`bg-slate-950/80 border ${checkoutErrors.clerk_id ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                    {checkoutErrors.clerk_id && <span className="text-xs text-red-400">{checkoutErrors.clerk_id}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">First Name</label>
                      <input type="text" name="first_name" value={profileForm.first_name} onChange={handleProfileFormChange} placeholder="First name" className={`bg-slate-950/80 border ${checkoutErrors.first_name ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.first_name && <span className="text-xs text-red-400">{checkoutErrors.first_name}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Last Name <span className="text-slate-500 font-normal">(Optional)</span></label>
                      <input type="text" name="last_name" value={profileForm.last_name} onChange={handleProfileFormChange} placeholder="Last name" className="bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address <span className="text-[10px] text-violet-400 font-normal font-mono">(@gmail.com only)</span></label>
                    <input type="email" name="email" value={profileForm.email} onChange={handleProfileFormChange} placeholder="name@gmail.com" className={`bg-slate-950/80 border ${checkoutErrors.email ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                    {checkoutErrors.email && <span className="text-xs text-red-400">{checkoutErrors.email}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                      <input type="tel" name="phone_number" value={profileForm.phone_number} onChange={handleProfilePhoneChange} placeholder="+9198765..." className={`bg-slate-950/80 border ${checkoutErrors.phone_number ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.phone_number && <span className="text-xs text-red-400">{checkoutErrors.phone_number}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
                      <input type="date" name="date_of_birth" value={profileForm.date_of_birth} onChange={handleProfileFormChange} className={`bg-slate-950/80 border ${checkoutErrors.date_of_birth ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none scheme-dark`} />
                      {checkoutErrors.date_of_birth && <span className="text-xs text-red-400">{checkoutErrors.date_of_birth}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="text-xs font-semibold text-slate-300">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button key={g} type="button" onClick={() => handleProfileGenderSelect(g)} className={`py-2 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${profileForm.gender === g ? 'border-violet-500 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'}`}>{g}</button>
                      ))}
                    </div>
                    {checkoutErrors.gender && <span className="text-xs text-red-400">{checkoutErrors.gender}</span>}
                  </div>
                  <button type="submit" disabled={isCheckoutSubmitting} className="w-full py-3.5 rounded-lg font-bold bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer">
                    {isCheckoutSubmitting ? 'Saving Details...' : 'Save & Continue'}
                  </button>
                </form>
              )}
              {/* Wizard Step 2: Shipping Address */}
              {checkoutStep === 2 && (
                <form onSubmit={handleAddressSubmit} className="flex flex-col gap-5">
                  <div className="border-b border-slate-850 pb-4 flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                        <span>Step 2 of 2</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                        <span className="text-slate-500">Shipping</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-100">Shipping Address</h3>
                      <p className="text-sm text-slate-400">Where should we deliver your order?</p>
                    </div>
                    <button type="button" onClick={() => setCheckoutStep(1)} className="text-xs text-violet-400 underline font-semibold hover:text-violet-300">Back</button>
                  </div>
                  {checkoutSubmitError && (
                    <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex items-start gap-2.5">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <div>
                        <p className="font-bold">Error saving address</p>
                        <p>{checkoutSubmitError}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Recipient Name</label>
                      <input type="text" name="recipient_name" value={addressForm.recipient_name} onChange={handleAddressFormChange} placeholder="e.g. John Doe" className={`bg-slate-950/80 border ${checkoutErrors.recipient_name ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.recipient_name && <span className="text-xs text-red-400">{checkoutErrors.recipient_name}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Recipient Phone</label>
                      <input type="tel" name="recipient_phone" value={addressForm.recipient_phone} onChange={handleAddressPhoneChange} placeholder="e.g. +9198765..." className={`bg-slate-950/80 border ${checkoutErrors.recipient_phone ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.recipient_phone && <span className="text-xs text-red-400">{checkoutErrors.recipient_phone}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Address Line 1</label>
                    <input type="text" name="address_line1" value={addressForm.address_line1} onChange={handleAddressFormChange} placeholder="House / Flat No, Street" className={`bg-slate-950/80 border ${checkoutErrors.address_line1 ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                    {checkoutErrors.address_line1 && <span className="text-xs text-red-400">{checkoutErrors.address_line1}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Address Line 2 <span className="text-slate-500 font-normal">(Optional)</span></label>
                    <input type="text" name="address_line2" value={addressForm.address_line2} onChange={handleAddressFormChange} placeholder="Apartment, Suite, Landmark" className="bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">City</label>
                      <input type="text" name="city" value={addressForm.city} onChange={handleAddressFormChange} placeholder="City" className={`bg-slate-950/80 border ${checkoutErrors.city ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.city && <span className="text-xs text-red-400">{checkoutErrors.city}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">State / Province</label>
                      <input type="text" name="state" value={addressForm.state} onChange={handleAddressFormChange} placeholder="State" className={`bg-slate-950/80 border ${checkoutErrors.state ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.state && <span className="text-xs text-red-400">{checkoutErrors.state}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Pincode <span className="text-slate-500 font-normal">(6 digits)</span></label>
                      <input type="text" name="postal_code" value={addressForm.postal_code} onChange={handleAddressPincodeChange} placeholder="Pincode" className={`bg-slate-950/80 border ${checkoutErrors.postal_code ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.postal_code && <span className="text-xs text-red-400">{checkoutErrors.postal_code}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Country</label>
                      <input type="text" name="country" value={addressForm.country} onChange={handleAddressFormChange} placeholder="Country" className={`bg-slate-950/80 border ${checkoutErrors.country ? 'border-red-500/50' : 'border-slate-800 focus:border-violet-500'} rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none`} />
                      {checkoutErrors.country && <span className="text-xs text-red-400">{checkoutErrors.country}</span>}
                    </div>
                  </div>
                  <button type="submit" disabled={isCheckoutSubmitting} className="w-full py-3.5 rounded-lg font-bold bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer">
                    {isCheckoutSubmitting ? 'Placing Order...' : 'Complete Checkout & Place Order'}
                  </button>
                </form>
              )}
              {/* Wizard Step 3: Success Screen */}
              {checkoutStep === 3 && (
                <div className="text-center py-6 animate-fade-in flex flex-col items-center">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/35 rounded-full flex items-center justify-center text-emerald-400 mb-5">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-100 mb-1">Order Confirmed!</h3>
                  <p className="text-slate-400 text-sm font-mono mb-6">Order ID: <span className="text-violet-400 font-bold">{orderNumber}</span></p>
                  
                  <div className="w-full text-left bg-slate-950/60 border border-slate-850 rounded-xl p-5 mb-6 text-xs text-slate-300 flex flex-col gap-2.5">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Shipping Details</span>
                    <div><span className="text-slate-400">Recipient:</span> {addressForm.recipient_name} ({addressForm.recipient_phone})</div>
                    <div><span className="text-slate-400">Address:</span> {addressForm.address_line1}, {addressForm.address_line2 ? `${addressForm.address_line2}, ` : ''}{addressForm.city}, {addressForm.state} - {addressForm.postal_code}, {addressForm.country}</div>
                    <div className="border-t border-slate-850 pt-2.5 mt-1 text-[10px] text-slate-500 flex justify-between">
                      <span>Delivery: <strong>Identity Express</strong></span>
                      <span>Estimate: <strong>3-5 business days</strong></span>
                    </div>
                  </div>
                  <button onClick={handleOrderCompleted} className="w-full py-3.5 rounded-lg font-bold bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg text-sm cursor-pointer">
                    Continue Shopping
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-50 mb-1">Custom {item.garment.charAt(0).toUpperCase() + item.garment.slice(1)} ({item.size})</h3>
                  <p className="text-sm text-slate-400">Added {item.timestamp}</p>
                  <button onClick={() => navigate('/register?redirect=checkout')} className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium transition-colors">Checkout</button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderOrdersView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
export default Dashboard;
