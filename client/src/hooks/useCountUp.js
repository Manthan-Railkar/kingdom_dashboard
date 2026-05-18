import { useEffect, useState } from 'react';

export function useCountUp(target, duration = 1500, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    let timer;

    const delayTimer = setTimeout(() => {
      timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setValue(target);
          clearInterval(timer);
        } else {
          setValue(Math.floor(start));
        }
      }, 16);
    }, delay);

    return () => { clearTimeout(delayTimer); clearInterval(timer); };
  }, [target, duration, delay]);

  return value;
}
