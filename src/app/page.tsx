import Navbar from  "../app/components/navbar"
import HeroSection from "../app/components/hero"
import OurWorkSection from "../app/components/ourwork"
import AboutSection from "../app/components/aboutus"
import ContactUsSection from "../app/components/contactus"
// import Footer from "../app/components/footer"

export default function Home() {
  return (
   <>
   <div className="relative">
   <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
   <Navbar/>
   <HeroSection/>
   <OurWorkSection/>
   <AboutSection/>
   <ContactUsSection/>
   {/* <Footer/> */}
   </div>
   </>
  );
}
