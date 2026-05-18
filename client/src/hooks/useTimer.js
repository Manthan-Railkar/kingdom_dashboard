import { useEffect, useState } from 'react';

export function useTimer(round) {
  const [timeLeft, setTimeLeft] = useState({ hrs: '00', mins: '00', secs: '00', total: 0 });

  useEffect(() => {
    if (!round || round.status === 'ended' || round.status === 'paused') return;

    const calc = () => {
      if (!round.startTime) return;
      const start = new Date(round.startTime).getTime();
      const durationMs = (round.durationMinutes || 90) * 60 * 1000;
      const end = start + durationMs;
      const remaining = Math.max(0, end - Date.now());
      const total = Math.floor(remaining / 1000);
      const hrs = Math.floor(total / 3600);
      const mins = Math.floor((total % 3600) / 60);
      const secs = total % 60;
      setTimeLeft({
        hrs: String(hrs).padStart(2, '0'),
        mins: String(mins).padStart(2, '0'),
        secs: String(secs).padStart(2, '0'),
        total,
      });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [round]);

  return timeLeft;
}
