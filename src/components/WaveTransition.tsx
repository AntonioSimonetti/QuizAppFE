import { useEffect } from 'react';
import '../styles/WaveTransition.css';

interface WaveTransitionProps {
  onAnimationComplete: () => void;
}

const WaveTransition = ({ onAnimationComplete }: WaveTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1000); 

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return <div className="wave-transition" />;
};

export default WaveTransition;
