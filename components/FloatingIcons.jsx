"use client";

import { motion } from "framer-motion";
import ENABLE_FLOATING_ICONS from "./FloatingIconController";

const floatingIcons = [
  "/icon/tshirt.jpg",
  "/icon/pants.jpeg",
  "/icon/shirt.png",
  "/icon/socks.png",
];

export default function FloatingIcons({ alwaysShow = false }) {
  // alwaysShow = true forces display (used for Hero.jsx)
  if (!ENABLE_FLOATING_ICONS && !alwaysShow) return null;

  return (
    <>
      {floatingIcons.map((icon, i) => (
        <motion.img
          key={i}
          src={icon}
          alt="Laundry Icon"
          className="absolute w-12 h-12 opacity-40"
          initial={{ y: -50, x: Math.random() * 500 }}
          animate={{
            y: [-50, 600, -50],
            x: [Math.random() * 500, Math.random() * 500, Math.random() * 500],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12 + Math.random() * 6,
            ease: "easeInOut",
            delay: i,
          }}
        />
      ))}
    </>
  );
}
