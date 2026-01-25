"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Student One", feedback: "The service is amazing! I never have to worry about my laundry.", img: "/team/student1.jpg" },
  { name: "Student Two", feedback: "Quick and reliable delivery. Highly recommend Smart Wash Hub!", img: "/team/student2.png" },
  { name: "Student Three", feedback: "Great experience, clean clothes and friendly staff.", img: "/team/student3.png" },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="testimonials" className="relative px-8 md:px-20 py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Students Say</h2>

      {/* Colored floating blobs */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 opacity-30 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200 dark:bg-pink-700 opacity-30 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="grid md:grid-cols-3 gap-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            variants={cardVariants}
          >
            <img src={t.img} className="w-20 h-20 mx-auto rounded-full mb-4" />
            <p className="italic mb-2 text-gray-700 dark:text-gray-300">"{t.feedback}"</p>
            <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
