import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const InteractiveCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('Neural Select');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    const touchCheck = window.matchMedia('(pointer: coarse)').matches;
    if (touchCheck) return; // Exit if touch
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      
      // Dynamic Cursor Labels based on target
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                         target.tagName === 'BUTTON' || 
                         target.tagName === 'A' ||
                         target.closest('button') ||
                         target.closest('a');

      setIsPointer(!!isClickable);

      // Specific Section Labels
      if (target.closest('[id="facility-grid"]') || target.closest('button[onClick*="facility-grid"]')) {
        setCursorLabel('Inspect Unit');
      } else if (target.closest('[id="admin-alerts"]') || target.closest('button[onClick*="admin-alerts"]')) {
        setCursorLabel('View Alerts');
      } else if (target.closest('[id="impact-analytics"]')) {
        setCursorLabel('Analyze Flow');
      } else if (isClickable) {
        setCursorLabel('Neural Select');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-atmosAccent rounded-full pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          scale: isPointer ? 1.5 : 1,
          opacity: isVisible ? 0.5 : 0,
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-atmosAccent rounded-full pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          scale: isPointer ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Dynamic Label */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] ml-6 mt-6 hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isPointer ? 1 : 0,
        }}
      >
        <div className="text-[8px] font-bold text-atmosAccent uppercase tracking-widest whitespace-nowrap bg-atmosBgAlt/90 px-3 py-1.5 rounded-full border border-atmosAccent/30 backdrop-blur-xl shadow-2xl">
          {cursorLabel}
        </div>
      </motion.div>
    </>
  );
};

export default InteractiveCursor;
