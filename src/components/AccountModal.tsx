import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'reasonjean04@gmail.com',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'features'>('signin');
  const [submitted, setSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#e0e3eb]">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-5 fill-current text-[#131722]"
              fill="none"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.7 0H0v28h8.7V0z"></path>
              <path d="M19.7 7.2H11V28h8.7V7.2z"></path>
              <path d="M30.7 14.5H22V28h8.7V14.5z"></path>
            </svg>
            <h3 className="text-base font-bold text-[#131722]">TradingView Account</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#089981] mx-auto" />
              <h4 className="text-lg font-bold text-[#131722]">Welcome to TradingView</h4>
              <p className="text-xs text-[#787b86]">
                You are currently connected as <span className="font-semibold text-[#131722]">{emailInput}</span>. Real-time market streaming, custom alerts, and personalized watchlists are active.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#131722] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Back to Markets
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-xl font-bold text-[#131722]">Look first / Then leap.</h4>
                <p className="text-xs text-[#787b86]">
                  Join 60M+ traders and investors tracking global markets in real-time.
                </p>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#e0e3eb] hover:bg-[#f0f3fa] rounded-xl text-xs font-semibold text-[#131722] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.27-2.09 3.645-5.18 3.645-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.41 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.59 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-2 my-3 text-[11px] text-[#787b86]">
                  <span className="flex-1 h-px bg-[#e0e3eb]"></span>
                  <span>or enter email</span>
                  <span className="flex-1 h-px bg-[#e0e3eb]"></span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#787b86] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e0e3eb] rounded-xl text-xs outline-none focus:border-[#2962ff]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="tv-btn-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Continue
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e0e3eb] flex items-center gap-2 text-[11px] text-[#787b86]">
                <ShieldCheck className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Protected by 256-bit encryption. Real-time market feed from ICE Data Services.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
