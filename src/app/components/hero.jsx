// HeroSection.jsx

export default function HeroSection() {
  return (
    <section className="w-full my-1 ">
      <div className="mx-auto max-w-7xl px-6 py-12 text-center  ">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-tight">
          Automotive & Industrial Component Manufacturing
        </h1>

        {/* Sub Text */}
        <p className="mt-6 max-w-3xl mx-auto text-lg text-black leading-relaxed">
          Precision machining, quality inspection, and reliable production
          engineered to meet strict industry standards.
        </p>
      </div>
    </section>
  );
}
