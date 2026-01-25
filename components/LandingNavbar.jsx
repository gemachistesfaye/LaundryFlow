"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState(""); // Scroll spy
  const [scrolled, setScrolled] = useState(false); // Logo shrink
  const overlayRef = useRef(null);
  const menuBtnRef = useRef(null);

  const links = [
    { id: "services", label: "Services", href: "#services" },
    { id: "stats", label: "Stats", href: "#stats" },
    { id: "faq", label: "FAQ", href: "#faq" },
    { id: "team", label: "Team", href: "#team" },
    { id: "testimonials", label: "Testimonials", href: "#testimonials" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  // Dark mode toggle
  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

  // Scroll spy and logo shrink
  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      links.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (window.scrollY >= top - 100 && window.scrollY < top + height - 100) {
            current = link.id;
          }
        }
      });
      setActiveSection(current);
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  // Close overlay on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        overlayRef.current &&
        !overlayRef.current.contains(e.target) &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  // Animation variants
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  // Smooth scroll handler
  const handleScrollTo = (href) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with shrink */}
        <a
          href="/"
          className={`font-bold text-gray-900 dark:text-white transition-all duration-300 ${
            scrolled ? "text-xl" : "text-2xl"
          }`}
        >
          Smart Wash Hub
        </a>

        {/* Right side: Login/Register + Dark toggle + Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 font-medium transition"
          >
            Register
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            ref={menuBtnRef}
            onClick={() => setMenuOpen((s) => !s)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Sliding right overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={overlayRef}
              className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close button at top */}
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition mb-4"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Links with hover animation, smooth scroll, scroll spy */}
              <motion.div
                className="flex flex-col gap-3 flex-1"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {links.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => handleScrollTo(link.href)}
                    className={`group relative text-left py-2 text-lg font-medium transition-colors duration-200 ${
                      activeSection === link.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                    variants={itemVariants}
                  >
                    {link.label}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[2px] transition-all duration-300 ${
                        activeSection === link.id
                          ? "w-full bg-blue-600 dark:bg-blue-400"
                          : "w-0 bg-blue-500 dark:bg-blue-400 group-hover:w-full"
                      }`}
                    ></span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Dark/Light toggle inside overlay */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
