import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Cross-fades between routes. The outgoing view is held for one frame budget
 * so navigation reads as a transition rather than an instant swap; scroll is
 * reset at the midpoint, while the old view is still faded out.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(children);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // This state update intentionally starts the exit animation
    // before swapping the displayed route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);

    const timer = setTimeout(() => {
      setDisplayed(children);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setVisible(true);
    }, 140);

    return () => clearTimeout(timer);
    // Children are captured on navigation only; re-running on every render
    // would restart the fade whenever state inside a page changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div
      className={`transition-[opacity,transform] duration-150 ease-out-quint ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      {displayed}
    </div>
  );
}