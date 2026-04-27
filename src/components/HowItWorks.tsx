const steps = [
  {
    number: "1",
    title: "Choose Your City",
    description:
      "Select from 500+ cities across India to find local wedding vendors near you.",
  },
  {
    number: "2",
    title: "Browse Categories",
    description:
      "Explore 18+ categories — from venues and decor to photography, catering, and more.",
  },
  {
    number: "3",
    title: "Connect with Vendors",
    description:
      "View portfolios, compare prices, read reviews, and book your perfect wedding team.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            How It{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Plan your wedding in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-shaadi-red to-shaadi-pink flex items-center justify-center text-white text-2xl font-bold shadow-lg relative z-10">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
