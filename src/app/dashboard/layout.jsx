"use client";

import Navbar2 from "../components/navbar2";
import SubNavbar from "../generate-bill-components/mininavbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar2 />
      <SubNavbar />
      {/* the page.jsx isact like the children page the sothe page,jsx should be taken like this */}
      {children}

    </div>
  );
}
