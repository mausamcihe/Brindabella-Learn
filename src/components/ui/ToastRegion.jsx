import { useToast } from '../../context/ToastContext';
import { Icon } from './Icon';

/**
 * Renders queued confirmations. The wrapper is a polite live region, so a
 * screen reader announces each message once the user's current utterance
 * finishes instead of cutting across it.
 */
export function ToastRegion() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast${toast.tone === 'error' ? ' toast--error' : ''}`}>
          <Icon name={toast.tone === 'error' ? 'alert' : 'check'} size={18} />
          <p>{toast.message}</p>
          <button type="button" className="toast__dismiss" onClick={() => dismiss(toast.id)}>
            <Icon name="close" size={14} title="Dismiss message" />
          </button>
        </div>
      ))}
    </div>
  );
}
