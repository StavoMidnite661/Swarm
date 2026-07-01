import { motion } from 'motion/react';

interface StartButtonScreenProps {
  onStart: () => void;
}

export default function StartButtonScreen({ onStart }: StartButtonScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-6 border border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-mono text-xl uppercase tracking-[0.3em] transition-all"
      >
        Click here to start
      </motion.button>
    </motion.div>
  );
}
