"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Something went wrong loading this section.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2 text-sm font-semibold rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
