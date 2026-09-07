import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Application-wide confirmation messages.
 *
 * Every action that changes something the learner cares about ends in a
 * toast, so the interface always answers "did that work?". Messages are
 * also written into a polite live region by the ToastRegion component so
 * screen reader users get the same confirmation sighted users do.
 */
const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'success') => {
      const id = ++nextId;
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => dismiss(id), 6000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider.');
  }
  return context;
}
