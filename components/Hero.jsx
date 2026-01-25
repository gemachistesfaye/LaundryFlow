"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const floatingIcons = [
  "/icon/tshirt.jpg",
  "/icon/pants.jpeg",
  "/icon/shirt.png",
  "/icon/socks.png",
];

// Learn More modal content
const learnMoreSteps = [
  {
    title: "Current Problem & Challenges",
    content: (
      <>
        <p className="mb-4">
          Many students rely on women who wash clothes manually near dorm buildings.
          It can take a week or more to get clothes back, and clothes often go missing.
          No tracking system exists, and students must personally wait to retrieve their laundry.
          This can negatively impact academic performance.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Manual washing is slow and unreliable</li>
          <li>No proper space or washing machines</li>
          <li>Clothes may get lost or mixed up</li>
          <li>Students waste time waiting for laundry</li>
        </ul>
      </>
    ),
    color: "red",
    icon: "/icon/problem.jpg",
  },
  {
    title: "Our Solution: Smart Wash Hub",
    content: (
      <>
        <p className="mb-4">
          A digital laundry management system designed for university students:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Track student clothes efficiently</li>
          <li>Provide proper washing areas and machines</li>
          <li>Reduce waiting time</li>
          <li>Ensure safe delivery of clothes</li>
          <li>Improve student convenience and academic focus</li>
        </ul>
      </>
    ),
    color: "green",
    icon: "/icon/solution.jpg",
  },
];

// Get Started onboarding modal content
const onboardingSteps = [
  {
    title: "Step 1: Add Your Clothes",
    content: (
      <p className="mb-4">
        Register or login and add the clothes you want washed. Include type, color, and quantity for each item.
      </p>
    ),
    color: "blue",
    icon: "/icon/add-clothes.jpg",
  },
  {
    title: "Step 2: Washing Process",
    content: (
      <p className="mb-4">
        Your clothes are washed using proper machines and tracked digitally. You can monitor their status in real-time.
      </p>
    ),
    color: "purple",
    icon: "/icon/washing.png",
  },
  {
    title: "Step 3: Delivery & Pickup",
    content: (
      <p className="mb-4">
        Washed clothes are delivered safely. You receive notifications when your laundry is ready for pickup.
      </p>
    ),
    color: "green",
    icon: "/icon/delivery.jpg",
  },
];

export default function Hero() {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Prevent background scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow = showLearnMore || showOnboarding ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showLearnMore, showOnboarding]);

  const nextStep = () => {
    const stepsArray = showLearnMore ? learnMoreSteps : onboardingSteps;
    if (step < stepsArray.length - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const getCurrentSteps = () => (showLearnMore ? learnMoreSteps : onboardingSteps);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-32 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Laundry Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Floating Laundry Icons */}
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
          }}
          transition={{
            repeat: Infinity,
            duration: 12 + Math.random() * 6,
            ease: "easeInOut",
            delay: i,
          }}
        />
      ))}

      {/* Text Content */}
      <motion.div
        className="md:w-1/2 space-y-6 relative z-10 bg-white/20 dark:bg-gray-900/30 p-6 rounded-lg backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
        }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }}
        >
          Welcome to Smart Wash Hub
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }}
        >
          Seamless University Laundry Management. Track, manage, and get your laundry delivered efficiently.
        </motion.p>

        <motion.div
          className="flex space-x-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
        >
          <button
            onClick={() => {
              setShowOnboarding(true);
              setStep(0);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => {
              setShowLearnMore(true);
              setStep(0);
            }}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>

      {/* Hero Illustration */}
      <motion.div
        className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src="/laundry-hero.jpg"
          alt="Laundry Illustration"
          className="w-full max-w-lg rounded-lg shadow-lg"
        />
      </motion.div>

      {/* Modal Card */}
      {(showLearnMore || showOnboarding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col items-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => {
                setShowLearnMore(false);
                setShowOnboarding(false);
              }}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={{
                  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center w-full text-center"
              >
                {/* Step Icon with Conditional Size */}
                <motion.img
                  src={getCurrentSteps()[step].icon}
                  alt="Step Icon"
                  className={`${showLearnMore ? "w-40 h-40" : "w-32 h-32"} mb-6`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />

                <h2
                  className={`text-2xl font-bold mb-4 ${
                    getCurrentSteps()[step].color === "red"
                      ? "text-red-600 dark:text-red-400"
                      : getCurrentSteps()[step].color === "green"
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {getCurrentSteps()[step].title}
                </h2>

                <div className="text-gray-700 dark:text-gray-300 text-left md:text-center leading-relaxed">
                  {getCurrentSteps()[step].content}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full mt-6">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  step === 0
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              {step === getCurrentSteps().length - 1 && showOnboarding ? (
                <button
                  onClick={() => (window.location.href = "/auth/register")}
                  className="px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Register Now
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={step === getCurrentSteps().length - 1}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    step === getCurrentSteps().length - 1
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
