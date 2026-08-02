import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Roughly one viewport down: far enough that scrolling back is a chore.
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas"
      tabIndex={visible ? 0 : -1}
      className={`
        fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full
        border border-line bg-surface/85 text-ink-soft shadow-lg backdrop-blur-xl
        transition-[opacity,transform,color] duration-250 ease-out-quint
        hover:text-brand-500
        ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}
      `}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
