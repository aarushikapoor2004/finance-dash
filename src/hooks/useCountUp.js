import { useEffect, useState, useRef } from 'react';

export default function useCountUp(end, duration = 1500, startOnMount = true) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!startOnMount) return;

    const numericEnd = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.-]/g, '')) : end;
    if (isNaN(numericEnd)) {
      setCount(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * numericEnd);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, startOnMount]);

  return count;
}
