import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { CatalogueProvider } from './context/CatalogueContext';
import { LearnerProvider } from './context/LearnerContext';
import { ToastProvider } from './context/ToastContext';

import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/ui.css';
import './styles/features.css';

/**
 * Provider order matters: toasts sit outermost because both the learner
 * and catalogue layers raise messages through them, and the router wraps
 * the app so any provider below it can read the current location.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <CatalogueProvider>
            <LearnerProvider>
              <App />
            </LearnerProvider>
          </CatalogueProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
