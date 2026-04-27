export default function BlogHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-shaadi-rose via-shaadi-pink to-rose-300" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Wedding Diaries
        </h1>
        <p className="mt-4 text-lg text-rose-100 max-w-xl mx-auto">
          Stories, trends, and inspiration for your dream Indian wedding
        </p>
      </div>
    </section>
  );
}
