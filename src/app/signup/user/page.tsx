"use client";

import { useState } from "react";
import Link from "next/link";

export default function UserSignUpPage() {
  const [step, setStep] = useState<"info" | "otp" | "done">("info");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    startResendTimer();
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: verify OTP via API
    setStep("done");
  };

  if (step === "done") {
    return (
      <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to ShaadiSetu!</h2>
          <p className="text-slate-500 mb-6">
            Your account has been created successfully. Start exploring the best wedding vendors near you.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity"
          >
            Explore Vendors
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md py-12">
        {/* Back link */}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-shaadi-red transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink px-6 py-5">
            <h1 className="text-xl font-bold text-white">
              {step === "info" ? "Create Your Account" : "Verify Phone Number"}
            </h1>
            <p className="text-rose-100 text-sm mt-1">
              {step === "info"
                ? "Plan your dream wedding with ShaadiSetu"
                : `OTP sent to +91 ${form.phone}`}
            </p>
          </div>

          {/* STEP: Info */}
          {step === "info" && (
            <form onSubmit={handleSendOtp} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-shaadi-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-shaadi-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="priya@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-shaadi-red">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-4 h-4 text-shaadi-red border-gray-300 rounded focus:ring-shaadi-rose accent-shaadi-red"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <span className="text-shaadi-red font-medium cursor-pointer hover:underline">Terms</span>{" "}
                  &{" "}
                  <span className="text-shaadi-red font-medium cursor-pointer hover:underline">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={form.phone.length !== 10}
                className="w-full py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send OTP
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors">
                  Log in
                </Link>
              </p>
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
                  +91 {form.phone}
                  <button
                    type="button"
                    onClick={() => setStep("info")}
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
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
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
                Verify & Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
