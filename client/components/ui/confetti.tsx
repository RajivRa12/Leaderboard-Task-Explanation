import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

const colors = [
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
];

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * 5 + 5,
          },
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.x + particle.velocity.x * 50,
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
          }}
          transition={{
            duration: 3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}
