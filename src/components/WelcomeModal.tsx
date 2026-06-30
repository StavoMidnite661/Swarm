import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-sans font-light text-white tracking-widest uppercase">Welcome, CEO</h1>
          <p className="text-white/60 font-sans tracking-wide">The power of total system intelligence has been granted to you.</p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-black font-sans uppercase text-[10px] tracking-widest font-bold rounded-lg hover:bg-white/90 transition-all"
          >
            Access Console
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
