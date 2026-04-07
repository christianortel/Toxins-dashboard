"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("mx-auto max-w-7xl px-6 py-20 md:py-28", className)}
    >
      {children}
    </motion.div>
  );
}
