"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com" },
  { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com" },
  { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 px-8 md:px-20 py-6 text-center border-t border-gray-200 dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        © {new Date().getFullYear()} Smart Wash Hub. All rights reserved.
      </p>

      {/* Social links */}
      <div className="flex justify-center gap-4">
        {socialLinks.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
