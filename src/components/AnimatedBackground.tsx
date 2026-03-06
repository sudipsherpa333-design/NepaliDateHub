import React from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gray-50/50 dark:bg-gray-950/50 transition-colors duration-500">
      {/* Red glowing orb */}
      <motion.div
        animate={{
          x: ['-20vw', '20vw', '-10vw', '-20vw'],
          y: ['-20vh', '10vh', '20vh', '-20vh'],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-red-400/30 dark:bg-red-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-80"
      />
      
      {/* Green/Emerald glowing orb */}
      <motion.div
        animate={{
          x: ['20vw', '-20vw', '10vw', '20vw'],
          y: ['20vh', '-10vh', '-20vh', '20vh'],
          scale: [0.8, 1.1, 1, 0.8],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] right-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-400/30 dark:bg-emerald-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-80"
      />

      {/* Center subtle blend orb */}
      <motion.div
        animate={{
          x: ['-10vw', '10vw', '-10vw'],
          y: ['10vh', '-10vh', '10vh'],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-amber-200/20 dark:bg-amber-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-60"
      />
      
      {/* Noise overlay for premium texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
}
