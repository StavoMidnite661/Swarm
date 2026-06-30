import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SentinelBriefing({ onComplete }: { onComplete: () => void }) {
  const [briefingStep, setBriefingStep] = useState(0);

  const briefings = [
    "Good afternoon, Sir.",
    "All systems have synchronized successfully.",
    "Treasury remains healthy.",
    "Engineering completed three deployments overnight.",
    "Legal has no pending compliance events.",
    "There are four executive actions requiring your review today.",
    "Would you like the detailed briefing?"
  ];

  useEffect(() => {
    if (briefingStep < briefings.length) {
      const timer = setTimeout(() => setBriefingStep(prev => prev + 1), 2000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [briefingStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="text-white text-2xl font-light tracking-widest text-center max-w-2xl px-6"
      >
        {briefings[briefingStep] || ""}
      </motion.div>
    </div>
  );
}
