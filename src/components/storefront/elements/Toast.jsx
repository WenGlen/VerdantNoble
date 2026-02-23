import { useState, useEffect } from 'react';

export default function Toast({ 
    message,
    duration = 3000,
    onClose,
}) {

    const [isEntered, setIsEntered] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsEntered(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);
        return () => clearTimeout(exitTimer);
    }, [message, duration]);

    useEffect(() => {
        if (!onClose) return;
        const closeTimer = setTimeout(onClose, duration + 300);
        return () => clearTimeout(closeTimer);
    }, [message, duration, onClose]);

    return (
        <div className="h-[120px] w-fit overflow-hidden pointer-events-none">
            <div
                className={`transition-all
                    ${!isEntered ? '-translate-y-full opacity-100' : isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                style={{ transitionDuration: isEntered || isExiting ? '300ms' : '0ms' }}
            >
                <div
                    className="mt-4 bg-secondary text-white px-4 py-2 rounded-md flex-row-center-center"
                    dangerouslySetInnerHTML={typeof message === 'string' ? { __html: message } : undefined}
                >
                    {typeof message !== 'string' ? message : null}
                </div>
            </div>
        </div>
    )
}