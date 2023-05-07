import React, { Component, ErrorInfo, ReactNode } from "react";
import "../errorBoundary.css"; // Import the CSS file

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  info?: React.ErrorInfo;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.log(error, info);

    // Update the state with the error and info
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              fill="#281A1A"
              fillRule="evenodd"
              d="M14.554 34.202h-1.618l-3.388-3.298a1.588 1.588 0 01-.49-1.024c-.01-.4.125-.784.397-1.077l1.333-1.482-3.394-5.878a2.938 2.938 0 011.075-4.014l3.817-2.204-2.203-3.817L17.717 7l2.204 3.817 3.817-2.204a2.938 2.938 0 014.014 1.076l3.394 5.878 1.95-.413c.39-.09.789-.014 1.13.196.317.224.56.558.643.935l2.817 17.91c-1.916-.08-3.819-.761-5.501-1.947-3.585 2.512-8.17 2.512-11.754 0-1.793 1.263-3.835 1.954-5.877 1.954zM9.938 19.974l15.27-8.816 2.908 5.039-9.074 1.914-6.194 6.901-2.91-5.038z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#281A1A"
              d="M38.062 37.14c-2.043 0-4.085-.69-5.877-1.954-3.585 2.513-8.17 2.513-11.754 0-1.793 1.264-3.835 1.954-5.877 1.954h-2.939v2.939h2.939c2.013 0 4.025-.514 5.877-1.47a12.772 12.772 0 0011.754 0c1.85.956 3.849 1.47 5.877 1.47H41V37.14h-2.938z"
            ></path>
          </svg>
          <h1 className="error-title">That's an unrecoveable error.</h1>
          <p className="error-introduction">
            Ouch. You found a critical bug and the app crashed.
          </p>
          <p className="error-introduction">
            You can try to refresh the page or restart the app (you might need
            to Force Stop it). If that doesn't work - or you feel helpful and
            kind - you can join our Discord chat server here:
          </p>
          <a className="material-button" href="https://discord.gg/D8HBNVHFfa">
            Find us on Discord
          </a>
          <p className="error-introduction">
            and ideally send us a copy of the info below.
            <br />
            But please be respectful and realise we're just some guys with a
            family making this in our own time off - for free!
          </p>
          {this.state.error && (
            <p className="error-message">
              Error: {this.state.error.toString()}
            </p>
          )}
          {this.state.info && (
            <p className="error-message">
              Component Stack: {this.state.info.componentStack}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
