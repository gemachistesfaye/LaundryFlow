"use client";

import { motion } from "framer-motion";

const servicesData = [
  { title: "Pickup & Delivery", desc: "We pick up and deliver your laundry conveniently.", icon: "/icon/pickup.svg" },
  { title: "Quick Wash", desc: "Fast and efficient washing for all types of garments.", icon: "/icon/wash.svg" },
  { title: "Dry Cleaning", desc: "Professional dry cleaning service available.", icon: "/icon/dryclean.svg" },
];

export default function Services() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="services" className="relative px-8 md:px-20 py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Services</h2>

      <motion.div
        className="grid md:grid-cols-3 gap-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {servicesData.map((s, i) => (
          <motion.div
            key={i}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300 relative overflow-hidden"
            variants={cardVariants}
          >
            <motion.img
              src={s.icon}
              className="w-16 h-16 mx-auto mb-4 relative z-10"
              alt={s.title}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">{s.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
