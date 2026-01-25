"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const statsData = [
  { label: "Orders Delivered", value: 1250, icon: "/icon/orders.png" },
  { label: "Active Users", value: 875, icon: "/icon/users.jpg" },
  { label: "Registered Staff", value: 35, icon: "/icon/staff.jpg" },
];

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section
      id="stats"
      ref={ref}
      className="relative px-8 md:px-20 py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden"
    >
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Statistics
      </h2>

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
        className="grid md:grid-cols-3 gap-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {statsData.map((s, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col items-center"
            variants={cardVariants}
          >
            {s.icon && (
              <img
                src={s.icon}
                alt={s.label}
                className="w-12 h-12 mb-3"
              />
            )}
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {inView ? <CountUp end={s.value} duration={2} /> : 0}+
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
