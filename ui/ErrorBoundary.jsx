import { Component } from 'react';
import { Button } from './Button';

/**
 * Catches render-time errors anywhere below it so a single broken
 * component shows a recoverable message instead of a blank white page.
 * React has no hook equivalent, so this stays a class component.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is where a reporting service would be called.
    console.error('Unhandled interface error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="main__inner">
        <div className="state state--error" role="alert">
          <h1 className="state__title">This page stopped working</h1>
          <p className="state__body">
            Reloading usually clears it. If it keeps happening, let the support team know what
            you were doing at the time.
          </p>
          <Button variant="danger" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </div>
      </div>
    );
  }
}
