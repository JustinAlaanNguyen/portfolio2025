"use client";
import { motion } from "framer-motion";

type Props = {
  onClose: () => void;
};

export default function AboutMePage({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🌿 Gradient forest-like background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 animate-gradient" />

      {/* 🌱 Subtle leaf/fiber texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/green-fibers.png')] pointer-events-none" />

      {/* ✨ Soft glowing overlay for atmosphere */}
      <div className="absolute inset-0 bg-gradient-radial from-green-400/10 via-transparent to-transparent" />

      <div className="relative w-full h-full overflow-y-auto p-6 flex justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-green-800/60 border border-green-400/30 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700/80 transition backdrop-blur-sm"
        >
          ✕ Close
        </button>

        {/* 🌱 Main Content */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 border border-green-200/20 rounded-2xl p-10 shadow-2xl backdrop-blur-md max-w-3xl mx-auto my-20"
        >
          <h1 className="text-4xl font-bold text-green-100 mb-6">About Me</h1>
          <p className="text-green-50 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat
            eros eu magna viverra, nec ultrices nulla iaculis. Proin aliquam,
            velit ut cursus euismod, nunc orci ultrices urna.
          </p>
          <p className="text-green-50 leading-relaxed text-lg mt-4">
            Donec dictum lacus et odio vestibulum, non fringilla tortor
            facilisis. Fusce at est ac lorem bibendum tincidunt. Mauris in erat
            nec augue tempus elementum sit amet sed ligula.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
