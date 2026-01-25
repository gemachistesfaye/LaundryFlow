"use client";

import { motion } from "framer-motion";

const teamData = [
  { name: "Admin User", role: "Administrator", img: "/team/admin.jpg" },
  { name: "Coordinator", role: "Coordinator", img: "/team/coordinator.png" },
  { name: "Worker", role: "Worker", img: "/team/worker1.jpg" },
  { name: "Deliverer", role: "Deliverer", img: "/team/deliverer1.png" },
];

export default function Team() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="team" className="relative px-8 md:px-20 py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Our Team
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
        className="grid md:grid-cols-4 gap-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {teamData.map((t, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            variants={cardVariants}
            whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
            <p className="text-gray-600 dark:text-gray-300">{t.role}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
