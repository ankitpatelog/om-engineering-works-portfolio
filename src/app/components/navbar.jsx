"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Navbar() {
  <Toaster />;
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // 🔹 NEW STATE (ONLY ADDITION)
  const [showInfo, setShowInfo] = useState(null); // "mail" | "phone" | null

  const navItems = [
    { label: "Our Work", id: "ourwork" },
    { label: "About Us", id: "aboutus" },
    { label: "Contact Us", id: "contactus" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  const handlebill = () => {
    if (session) {
      toast.success("Welcome");
      setTimeout(() => router.push("/dashboard"), 500);
    } else {
      toast.success("Please log in generate bills");
      setTimeout(() => router.push("/login"), 500);
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
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-4">
            <a
              href="https://www.dropbox.com/scl/fi/mo4ry9eq4lb5wiai24438/OM_Engineering_Works_Profile.pdf?dl=1"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800
              hover:border-amber-500 hover:text-amber-600 transition-all"
            >
              Om Engg. Profile
            </a>

            <button
              onClick={handlebill}
              className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-white
              shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
            >
              Generate Bill
            </button>
          </div>

          {/* 🔹 ICONS BELOW BUTTONS */}
          <div className="relative flex gap-3 text-gray-500 mt-1">
            {/* MAIL */}
            <button
              type="button"
              onClick={() =>
                setShowInfo(showInfo === "mail" ? null : "mail")
              }
              title="Email"
            >
              <Mail size={14} className="hover:text-amber-600 transition" />
            </button>

            {/* PHONE */}
            <button
              type="button"
              onClick={() =>
                setShowInfo(showInfo === "phone" ? null : "phone")
              }
              title="Phone"
            >
              <Phone size={14} className="hover:text-amber-600 transition" />
            </button>

            {/* LOCATION */}
            <a
              href="https://maps.app.goo.gl/ZdSdVRFCMmP4eMos7"
              target="_blank"
              rel="noopener noreferrer"
              title="Location"
            >
              <MapPin size={14} className="hover:text-amber-600 transition" />
            </a>

            {/* 🔽 SMALL INFO BOX */}
            {showInfo && (
              <div className="absolute top-6 right-0 rounded-md border bg-white px-3 py-2 text-xs text-gray-700 shadow-md">
                {showInfo === "mail" && (
                  <span>📧 omengg21@gmail.com</span>
                )}
                {showInfo === "phone" && (
                  <span>📞 +91 98110 05905</span>
                )}
              </div>
            )}
          </div>
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
          </ul>
        </div>
      )}
    </header>
  );
}
