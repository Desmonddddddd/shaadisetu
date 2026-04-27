import Link from "next/link";

export default function SignUpPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Join{" "}
            <span className="bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            How would you like to register?
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* User Card */}
          <Link
            href="/signup/user"
            className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-shaadi-rose transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-shaadi-red to-shaadi-rose rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-shaadi-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-shaadi-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                I&apos;m Planning a Wedding
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Create your account to discover vendors, save favourites, get quotes, and plan your dream wedding.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-shaadi-red group-hover:gap-3 transition-all">
                Register as User
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Vendor Card */}
          <Link
            href="/signup/vendor"
            className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-shaadi-rose transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-shaadi-rose to-shaadi-pink rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-shaadi-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-shaadi-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                I&apos;m a Wedding Vendor
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                List your business, showcase your work, receive enquiries, and grow your wedding business across India.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-shaadi-rose group-hover:gap-3 transition-all">
                Register as Vendor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Already have an account */}
        <p className="mt-10 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
