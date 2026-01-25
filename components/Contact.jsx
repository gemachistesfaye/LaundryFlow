"use client";

import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative px-8 md:px-20 py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Contact Us</h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12">
        Have questions or need assistance? Send us a message or reach out directly.
      </p>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md z-10"
        >
          {submitted && (
            <p className="text-green-600 dark:text-green-400 mb-4 font-medium text-center">
              Thank you! Your message has been sent.
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Contact Info Panel with Map */}
        <div className="flex flex-col justify-start gap-6 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md z-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Get in touch</h3>
          <p className="text-gray-700 dark:text-gray-300">You can reach us via phone, email, or visit our office.</p>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Phone className="w-5 h-5" />
            <span>+251 911 123 456</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Mail className="w-5 h-5" />
            <span>support@smartwashhub.com</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>Haramaya University Campus, Ethiopia</span>
          </div>

          {/* Map Embed */}
          <div className="w-full h-48 mt-4 rounded-md overflow-hidden shadow">
            <iframe
              title="Smart Wash Hub Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3999.123456789!2d42.015!3d9.365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x123456789abcdef%3A0xabcdef123456789!2sHaramaya%20University%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
