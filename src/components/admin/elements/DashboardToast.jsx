import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const TOAST_DURATION = 3000;
const EXIT_ANIMATION_MS = 300;

export default function DashboardToast() {
  const messages = useSelector((state) => state.dashboardToast);
  const [enteredIds, setEnteredIds] = useState(new Set());
  const [exitingIds, setExitingIds] = useState(new Set());

  // Enter: trigger after mount (requestAnimationFrame)
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

  // Exit: after duration, mark as exiting
  useEffect(() => {
    if (messages.length === 0) return;
    const timers = messages.map((m) =>
      setTimeout(() => {
        setExitingIds((prev) => new Set(prev).add(m.id));
      }, TOAST_DURATION),
    );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  return (
    <div className="h-[200px] w-fit overflow-hidden pointer-events-none flex flex-col justify-end p-4 gap-4">
      {messages.map((message) => {
        const isEntered = enteredIds.has(message.id);
        const isExiting = exitingIds.has(message.id);
        return (
          <div key={message.id} className="overflow-hidden">
            <div
              className={`transition-all ${!isEntered ? "translate-y-full opacity-100" : isExiting ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
              style={{
                transitionDuration:
                  isEntered || isExiting ? `${EXIT_ANIMATION_MS}ms` : "0ms",
              }}
            >
              <div
                className={`${message.type === "success" ? "bg-admin-primary" : "bg-admin-text-error"} text-white px-8 py-2 rounded-md flex-row-center-center`}
              >
                {message.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
