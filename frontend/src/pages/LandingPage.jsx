import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, CreditCard, Activity, Shirt, User, Menu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Glassmorphism Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shirt className="h-8 w-8 text-indigo-600" />
              <span className="font-extrabold text-xl tracking-tight text-gray-900">LaundryFlow</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center font-medium text-sm text-gray-600">
              <a href="#features" className="hover:text-indigo-600 transition">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</a>
              <Link to="/login" className="hover:text-indigo-600 transition">Sign in</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm font-semibold">
                Get Started
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <Menu className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              University Laundry, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Reimagined.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto mb-10">
              Say goodbye to lost clothes and manual tracking. LaundryFlow brings real-time status updates, QR identification, and seamless digital payments to your campus.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
                Start Washing Today
              </Link>
              <Link to="/login" className="bg-white text-gray-800 border border-gray-200 px-8 py-3.5 rounded-full font-bold shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all">
                Track Laundry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Students', value: '5,000+' },
              { label: 'Successful Orders', value: '124K' },
              { label: 'Lost Clothes', value: '0%' },
              { label: 'Partner Campuses', value: '12' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Enterprise-Grade Features</h2>
            <p className="mt-4 text-gray-600">Built specifically for the high-volume demands of university campuses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Smart Tracking', desc: 'Real-time updates from submission to delivery using unique WASH codes.', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'Worker Workflow', desc: 'Dedicated worker dashboards to manage washing and drying queues efficiently.', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
              { title: 'Delivery System', desc: 'Integrated delivery dispatching to get clothes back to student dorms fast.', icon: Truck, color: 'text-green-600', bg: 'bg-green-100' },
              { title: 'Payment Management', desc: 'Secure digital payments via Telebirr or CBE with admin confirmation.', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100' },
              { title: 'Analytics Dashboard', desc: 'Comprehensive administrative oversight over revenue, tasks, and users.', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
              { title: 'QR Identification', desc: 'Eliminate lost items completely with our strict item tracking protocol.', icon: CheckCircle, color: 'text-pink-600', bg: 'bg-pink-100' },
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Shirt className="h-6 w-6 text-indigo-500" />
            <span className="font-bold text-lg text-white">LaundryFlow</span>
          </div>
          <p>© 2026 LaundryFlow Systems. Designed for INSA Evaluation.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
