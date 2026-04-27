"use client";

import { useState } from "react";
import Link from "next/link";
import { cities } from "@/data/cities";
import { categories } from "@/data/categories";

export default function VendorSignUpPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 — Business Info
    businessName: "",
    category: "",
    city: "",
    address: "",
    yearsExperience: "",
    description: "",
    // Step 2 — Contact
    contactPerson: "",
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    // Step 3 — KYC
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfsc: "",
  });

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    startResendTimer();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`vendor-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`vendor-otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setOtpVerified(true);
  };

  const canNext = () => {
    if (step === 1) return form.businessName && form.category && form.city && form.description;
    if (step === 2) return form.contactPerson && form.email && form.phone && otpVerified;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Under Review</h2>
          <p className="text-slate-500 mb-2">
            Thank you for registering <strong>{form.businessName}</strong> on ShaadiSetu.
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Our team will verify your KYC documents and business details. You&apos;ll receive a notification at <strong>{form.email}</strong> and <strong>+91 {form.phone}</strong> once verified.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Application submitted</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-slate-600">KYC & document verification <span className="text-xs text-slate-400">(24-48 hrs)</span></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-slate-400">Approved or Rejected — you&apos;ll be notified</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-slate-400">If approved, access your vendor dashboard</p>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-shaadi-red transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to sign up options
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink px-6 py-5 md:px-8">
            <h1 className="text-xl md:text-2xl font-bold text-white">Vendor Registration</h1>
            <p className="text-rose-100 text-sm mt-1">Grow your wedding business with ShaadiSetu</p>
          </div>

          {/* Progress */}
          <div className="px-6 md:px-8 pt-6">
            <div className="flex items-center justify-between mb-2">
              {["Business Info", "Contact & OTP", "KYC Documents"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white" : "bg-gray-100 text-slate-400"
                  }`}>
                    {step > i + 1 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${step === i + 1 ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-shaadi-red to-shaadi-rose transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 md:px-8 pb-8 space-y-5">
            {/* STEP 1 — Business Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Name <span className="text-shaadi-red">*</span></label>
                  <input type="text" required value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="e.g., Royal Wedding Photography" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-shaadi-red">*</span></label>
                    <select required value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent bg-white">
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <optgroup key={cat.id} label={`${cat.emoji} ${cat.name}`}>
                          {cat.subcategories.map((sub) => (
                            <option key={sub.id} value={`${cat.id}/${sub.id}`}>
                              {sub.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City <span className="text-shaadi-red">*</span></label>
                    <select required value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent bg-white">
                      <option value="">Select city</option>
                      {cities.map((city) => (<option key={`${city.name}-${city.state}`} value={city.name}>{city.name}, {city.state}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Shop/Office address" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                  <select value={form.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent bg-white">
                    <option value="">Select</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1 - 3 years</option>
                    <option value="3-5">3 - 5 years</option>
                    <option value="5-10">5 - 10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Description <span className="text-shaadi-red">*</span></label>
                  <textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell couples about your services and what makes you stand out..." className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent resize-none" />
                </div>
              </div>
            )}

            {/* STEP 2 — Contact + OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person <span className="text-shaadi-red">*</span></label>
                  <input type="text" required value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="e.g., Rajesh Kumar" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-shaadi-red">*</span></label>
                  <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="business@email.com" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-shaadi-red">*</span></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">+91</span>
                    <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" disabled={otpVerified} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent disabled:bg-gray-50" />
                  </div>
                </div>

                {/* OTP Verification */}
                {!otpVerified ? (
                  <div className="p-4 bg-shaadi-light/40 rounded-xl border border-shaadi-pink/20 space-y-3">
                    <p className="text-sm font-medium text-slate-700">Verify your phone number</p>
                    {!otpSent ? (
                      <button type="button" disabled={form.phone.length !== 10} onClick={handleSendOtp} className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        Send OTP
                      </button>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          {otp.map((digit, i) => (
                            <input key={i} id={`vendor-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} className="w-10 h-11 text-center text-base font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" disabled={otp.some((d) => !d)} onClick={handleVerifyOtp} className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                            Verify
                          </button>
                          {resendTimer > 0 ? (
                            <span className="text-xs text-slate-400">Resend in {resendTimer}s</span>
                          ) : (
                            <button type="button" onClick={startResendTimer} className="text-xs font-semibold text-shaadi-red hover:text-shaadi-rose">Resend OTP</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-green-700">Phone verified successfully</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">+91</span>
                    <input type="tel" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Same or different" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Instagram Handle</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">@</span>
                    <input type="text" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="yourbusiness" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — KYC */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>KYC Verification:</strong> These documents help us verify your business. Your listing will be activated after successful verification.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GST Number <span className="text-xs text-slate-400">(if applicable)</span></label>
                  <input type="text" value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value.toUpperCase().slice(0, 15))} placeholder="e.g., 22AAAAA0000A1Z5" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number <span className="text-shaadi-red">*</span></label>
                  <input type="text" required value={form.panNumber} onChange={(e) => update("panNumber", e.target.value.toUpperCase().slice(0, 10))} placeholder="e.g., ABCDE1234F" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number <span className="text-shaadi-red">*</span></label>
                  <input type="text" required value={form.aadhaarNumber} onChange={(e) => update("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12-digit Aadhaar number" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Bank Account Details <span className="text-xs font-normal text-slate-400">(for payouts)</span></h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
                      <input type="text" value={form.bankAccountName} onChange={(e) => update("bankAccountName", e.target.value)} placeholder="As per bank records" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                        <input type="text" value={form.bankAccountNumber} onChange={(e) => update("bankAccountNumber", e.target.value.replace(/\D/g, ""))} placeholder="Account number" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                        <input type="text" value={form.bankIfsc} onChange={(e) => update("bankIfsc", e.target.value.toUpperCase().slice(0, 11))} placeholder="e.g., SBIN0001234" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose focus:border-transparent uppercase" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="vendor-terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 text-shaadi-red border-gray-300 rounded focus:ring-shaadi-rose accent-shaadi-red" />
                  <label htmlFor="vendor-terms" className="text-sm text-slate-600">
                    I confirm that all information and documents provided are genuine. I agree to ShaadiSetu&apos;s{" "}
                    <span className="text-shaadi-red font-medium cursor-pointer hover:underline">Vendor Terms</span> and{" "}
                    <span className="text-shaadi-red font-medium cursor-pointer hover:underline">Privacy Policy</span>.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button type="button" disabled={!canNext()} onClick={() => setStep(step + 1)} className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              ) : (
                <button type="submit" disabled={!agreed || !form.panNumber || !form.aadhaarNumber} className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit for Verification
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              )}
            </div>

            <p className="text-center text-sm text-slate-500 pt-2">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
