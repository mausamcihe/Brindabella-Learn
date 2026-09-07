import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from './Icon';

/**
 * An accessible dialog: rendered in a portal so it is never clipped by a
 * parent's overflow, labelled by its own heading, focus-trapped while
 * open, and closable with Escape or a click on the backdrop.
 */
export function Modal({ isOpen, onClose, title, description, children, footer }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panelRef, isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="modal__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            <Icon name="close" size={16} title="Close dialog" />
          </button>
        </div>
        {description ? <p id={descriptionId}>{description}</p> : null}
        {children}
        {footer ? <div className="modal__actions">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
