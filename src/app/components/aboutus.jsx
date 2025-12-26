export default function AboutSection() {
  return (
    <section id="aboutus" className="w-full  py-12 sm:py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===== ABOUT US (FULL WIDTH) ===== */}
        <div className="mb-12 sm:mb-14">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide text-gray-900">
            About Us
          </h2>
          <div className="mt-2 h-1 w-16 sm:w-20 bg-amber-500"></div>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-700 leading-relaxed max-w-5xl">
            <strong>OM Engineering Works</strong> is a precision engineering
            company operated by a team of qualified and experienced engineers
            with a strong technical background in mechanical manufacturing.
          </p>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 leading-relaxed max-w-5xl">
            We specialize in the manufacturing of automobile parts and precision
            mechanical components, delivering consistent quality with a focus
            on accuracy, reliability, and customer satisfaction.
          </p>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-gray-900">
            Our philosophy is to produce components that are
            <span className="text-amber-600">
              {" "}“First Time Right and Every Time Right.”
            </span>
          </p>
        </div>

        {/* ===== THREE COLUMN SECTION ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">

          {/* Quality Assurance */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
              Quality Assurance Policy
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside">
              <li>Dimensional inspection at every stage of production</li>
              <li>Use of calibrated measuring instruments</li>
              <li>Final inspection before dispatch</li>
              <li>Strict adherence to customer drawings & tolerances</li>
              <li>Continuous monitoring for consistent quality</li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
              Why Choose OM Engineering Works
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside">
              <li>Experienced and skilled technical team</li>
              <li>High-precision manufacturing capability</li>
              <li>Strong quality control system</li>
              <li>On-time delivery commitment</li>
              <li>Cost-effective manufacturing solutions</li>
              <li>Long-term customer relationship focus</li>
            </ul>
          </div>

          {/* Industry Experience */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
              Industry Experience
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We have successfully supplied precision engineering components to
              reputed companies such as:
            </p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside">
              <li>M/s Mita India Pvt. Ltd.</li>
              <li>M/s Parkash Automotive Industries Pvt. Ltd.</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
