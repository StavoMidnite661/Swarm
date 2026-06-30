import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          <div className="flex justify-between items-center p-4 border-b border-white/5">
            <h2 className="text-white font-sans tracking-widest uppercase font-medium flex items-center gap-2">
              <SettingsIcon size={16} /> Settings
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-white/50 text-[10px] uppercase tracking-widest">Timezone</label>
              <select className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-white/90 text-sm focus:outline-none">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/50 text-[10px] uppercase tracking-widest">Terms & Conditions</label>
              <div className="text-[10px] text-white/40 leading-relaxed max-h-40 overflow-y-auto bg-white/[0.02] p-3 rounded-lg">
                By entering this console, you acknowledge that you are operating as an executive authority. Any data ingested is treated with absolute operational confidentiality. Penalties for unauthorized data exfiltration are severe and enforceable under the terms of the Sovereign Operating System.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
