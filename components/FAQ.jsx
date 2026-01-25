"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqData = [
  { 
    question: "How do I register?", 
    answer: "Click the Register button on the homepage, fill in your name, email, phone number, department, building, and dorm number, then submit. You will receive an OTP via email or SMS to verify your account. Only verified accounts can access the system." 
  },
  { 
    question: "Can I track my laundry?", 
    answer: "Yes! Once your order is placed and approved, you can track each step from pickup to delivery through your account dashboard. You will also receive notifications at each stage for updates." 
  },
  { 
    question: "Is delivery free?", 
    answer: "Delivery fees vary depending on your location within the campus. Standard delivery rates are displayed when placing your order, and any promotions or discounts will automatically be applied." 
  },
  { 
    question: "Can I cancel or change my order?", 
    answer: "You can cancel or modify an order only if it has not yet been accepted by a worker. Once the worker accepts, the order is in progress and cannot be changed." 
  },
  { 
    question: "What types of laundry services are available?", 
    answer: "Smart Wash Hub offers pickup & delivery, quick wash, dry cleaning, and special garment care. You can select the service type while placing an order." 
  },
];

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState(Array(faqData.length).fill(false));

  const toggleFaq = (index) => {
    setFaqOpen(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section id="faq" className="relative px-8 md:px-20 py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">FAQ</h2>

      <div className="max-w-3xl mx-auto space-y-4 relative z-10">
        {faqData.map((item, i) => (
          <motion.div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => toggleFaq(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900 dark:text-white">{item.question}</p>
              <span className="text-gray-700 dark:text-gray-300">{faqOpen[i] ? "▲" : "▼"}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: faqOpen[i] ? 1 : 0, height: faqOpen[i] ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
            >
              {faqOpen[i] && <p className="mt-2 text-gray-600 dark:text-gray-300">{item.answer}</p>}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
