"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    startResendTimer();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`login-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`login-otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: verify OTP & redirect to dashboard
    alert("Login successful!");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
          </Link>
          <p className="mt-2 text-slate-500 text-sm">Welcome back! Log in with your phone number.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* STEP: Phone */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">We&apos;ll send a 6-digit OTP to verify</p>
              </div>

              <button
                type="submit"
                disabled={phone.length !== 10}
                className="w-full py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send OTP
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-400">OR</span>
                </div>
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Sign up links */}
              <div className="text-center space-y-2 pt-2">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors">
                    Sign up
                  </Link>
                </p>
                <p className="text-xs text-slate-400">
                  Are you a vendor?{" "}
                  <Link href="/signup/vendor" className="font-medium text-shaadi-rose hover:text-shaadi-red transition-colors">
                    Register your business
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* STEP: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerify} className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-shaadi-light flex items-center justify-center">
                  <svg className="w-8 h-8 text-shaadi-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  +91 {phone}
                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
                    className="ml-2 text-xs text-shaadi-red hover:underline"
                  >
                    Change
                  </button>
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2.5">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`login-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                    className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-xs text-slate-400">
                    Resend OTP in <span className="font-semibold text-slate-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={startResendTimer}
                    className="text-xs font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={otp.some((d) => !d)}
                className="w-full py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify & Log In
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
