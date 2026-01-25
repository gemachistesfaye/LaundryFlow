"use client";

import { useState, useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Stats from "../components/Stats";
import FAQ from "../components/FAQ";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LandingNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <Services />
      <Stats />
      <FAQ />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
