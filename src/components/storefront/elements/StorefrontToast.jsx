import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TOAST_DURATION = 3000;
const EXIT_ANIMATION_MS = 300;

export default function StorefrontToast() {
  const messages = useSelector((state) => state.storefrontToast);
  const [enteredIds, setEnteredIds] = useState(new Set());
  const [exitingIds, setExitingIds] = useState(new Set());

  useEffect(() => {
    const ids = messages.map((m) => m.id);
    if (ids.length === 0) return;
    const rafId = requestAnimationFrame(() => {
      setEnteredIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const timers = messages.map((m) =>
      setTimeout(() => {
        setExitingIds((prev) => new Set(prev).add(m.id));
      }, TOAST_DURATION)
    );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="h-[300px] w-fit overflow-hidden pointer-events-none flex flex-col justify-start pt-4">
      {messages.map((item) => {
        const isEntered = enteredIds.has(item.id);
        const isExiting = exitingIds.has(item.id);
        return (
          <div key={item.id} className="overflow-hidden">
            <div
              className={`transition-all ${!isEntered ? '-translate-y-full opacity-100' : isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
              style={{ transitionDuration: isEntered || isExiting ? `${EXIT_ANIMATION_MS}ms` : '0ms' }}
            >
              <div
                className="mt-2 bg-secondary text-white px-4 py-2 rounded-md flex-row-center-center"
                dangerouslySetInnerHTML={typeof item.message === 'string' ? { __html: item.message } : undefined}
              >
                {typeof item.message !== 'string' ? item.message : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
