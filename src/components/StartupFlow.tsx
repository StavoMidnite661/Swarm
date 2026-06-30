import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function StartupFlow() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      {/* Executive Orb Placeholder - Will be replaced by WebGL/3D layer */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="w-64 h-64 rounded-full bg-gradient-to-tr from-accent-cyan via-accent-violet to-accent-gold opacity-30 blur-3xl absolute"
      />

      <div className="flex items-center justify-center h-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white text-3xl font-light tracking-widest uppercase text-center">
          Good afternoon, Sir.
          <div className="text-white/70 text-lg font-light mt-4 max-w-xl leading-relaxed">
            I've synchronized your assets, refined today's strategic priorities, and established secure links across the engineering and treasury clusters.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
