import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const GreetingHeader = ({ name, role, stats }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="mb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{today}</p>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            {getGreeting()}, {name}
            {role === 'admin' && <Sparkles className="h-6 w-6 text-yellow-500" />}
          </h1>
          <p className="text-sm text-gray-500 mt-2 capitalize bg-gray-100 inline-block px-3 py-1 rounded-full font-semibold border border-gray-200 shadow-sm">
            {role} Account
          </p>
        </div>
      </
      div>
    </div>
  );
};

export default GreetingHeader;
