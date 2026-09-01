import { ReactErrorBoundary } from "@dekiru/react-error-boundary";

import type { PropsWithChildren } from "react";

export default function ErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ReactErrorBoundary
      render={({ closeError, DevExtraInfo, errorMessage, hasError: _ }) => {
        return (
          <div>
            <p>An error has occurred</p>
            <div>
              Error message:
              <br />
              {errorMessage}
            </div>
            <button type="button" onClick={closeError}>
              Try again
            </button>
            {import.meta.env.MODE === "development" && <DevExtraInfo />}
          </div>
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
