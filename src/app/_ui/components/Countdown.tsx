"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/ui/hooks/useCountdown";

interface CountdownProps {
  onGoClick: () => void;
}

export const Countdown = ({ onGoClick }: CountdownProps) => {
  const countdown = useCountdown(3);

  return (
    <motion.div
      key="countdown"
      variants={{
        initial: {
          background: "#f4918e",
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          background: "#FF6A66",
          clipPath: "circle(100% at 50% 50%)",
        },
        exit: {
          background: "#f4918e",
          clipPath: "circle(0% at 50% 50%)",
        }
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.25rem'
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-white font-bold text-[32px]">
        <h1>Daily Practice Paper</h1>
        <p className="mt-[116px]">Your test starts in</p>
        <div className="flex justify-center items-center mt-[38px] rounded-full border-8 border-white w-[196px] h-[196px] bg-transparent">
          {countdown !== 0 ? (
            <motion.span
              key={`count-${countdown}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-[118px]"
            >
              {countdown}
            </motion.span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[88px] cursor-pointer bg-transparent border-none"
              onClick={onGoClick}
            >
              GO
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};