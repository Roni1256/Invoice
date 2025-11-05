import React, { useState, useRef, useEffect, useContext } from 'react';
import { FileText, Mail, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import { UserContext } from '../App';

const Verification = () => {
  const navigate=useNavigate()
  const hrefData=useLocation().state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const [user,setUser]=useContext(UserContext)

  // Email (you can pass this as a prop or get from routing state)
  const email = hrefData.email|| "user@example.com";

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async(e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('Verifying OTP:', otpValue);
      try {
        const response=await axiosInstance.post('/authentication/verification',{
          email,
          code:otpValue
        })
        setUser(response.data.returningObj)
        navigate("/startup")
      } catch (error) {
        console.log(error);
        
      }
    }
  };

  const handleResend = async() => {
    if (canResend) {
      console.log('Resending OTP');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      try {
        const response=await axiosInstance.post('/authentication/resend-code',{
          email
        })
        console.log("Resend Response:",response);
      } catch (error) {
        console.log("Resending Error:",error);
        
      }      
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sign In</span>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="logo.png" alt="logo" width={150} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Verify Your Email
          </h2>
          <p className="text-text-secondary">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-primary font-medium mt-1">{email}</p>
        </div>

        {/* Verification Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          <form onSubmit={handleVerify}>
            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Timer/Resend */}
            <div className="text-center mb-6">
              {!canResend ? (
                <p className="text-sm text-text-secondary">
                  Resend code in{' '}
                  <span className="font-semibold text-primary">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition"
                >
                  Resend verification code
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isComplete}
              className={`w-full py-3 px-4 rounded-lg font-medium text-lg shadow-lg transition ${
                isComplete
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Verify Email
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Didn't receive the code?{' '}
              <button className="text-primary hover:text-primary-dark font-medium">
                Check spam folder
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary">
            This code will expire in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;