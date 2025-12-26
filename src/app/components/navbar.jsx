"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Our Work", id: "ourwork" },
    { label: "About Us", id: "aboutus" },
    { label: "Contact Us", id: "contactus" },
  ];

  // Smooth scroll function (NO PAGE CHANGE)
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false); // close mobile menu
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT – BRAND */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600 font-extrabold">
            OM
          </div>
          <span className="text-lg font-semibold tracking-wide text-gray-900">
            OM <span className="text-amber-600">Engineering</span> Works
          </span>
        </div>

        {/* CENTER – DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="relative hover:text-gray-900 transition-colors
                after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                after:w-0 after:bg-amber-500 after:transition-all
                hover:after:w-full"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* RIGHT – DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/brochure.pdf"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800
            hover:border-amber-500 hover:text-amber-600 transition-all"
          >
            Download Brochure
          </a>

          <a
            href="/generate-bill"
            className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-white
            shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
          >
            Generate Bill
          </a>
        </div>

        {/* HAMBURGER – MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5"
        >
          <span className="h-0.5 w-6 bg-gray-800"></span>
          <span className="h-0.5 w-6 bg-gray-800"></span>
          <span className="h-0.5 w-6 bg-gray-800"></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left hover:text-amber-600"
                >
                  {item.label}
                </button>
              </li>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/brochure.pdf"
                className="rounded-md border border-gray-300 px-4 py-2 text-center font-semibold text-gray-800
                hover:border-amber-500 hover:text-amber-600 transition-all"
              >
                Download Brochure
              </a>

              <a
                href="/generate-bill"
                className="rounded-md bg-amber-500 px-4 py-2 text-center font-semibold text-white
                hover:bg-amber-400 transition-all"
              >
                Generate Bill
              </a>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
}
