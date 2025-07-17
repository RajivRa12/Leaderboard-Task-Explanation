import { motion } from "framer-motion";

interface PulseRingProps {
  className?: string;
  children?: React.ReactNode;
}

export function PulseRing({ className = "", children }: PulseRingProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-15"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.15, 0, 0.15],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      {children}
    </div>
  );
}
