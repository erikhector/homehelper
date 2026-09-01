import { ReactErrorBoundary } from "@dekiru/react-error-boundary";

import type { PropsWithChildren } from "react";

export default function ErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ReactErrorBoundary
      render={({ closeError, DevExtraInfo, errorMessage, hasError: _ }) => {
        return (
          <div>
            <p>Ett fel har uppstått</p>
            <div>
              Felmeddelande:
              <br />
              {errorMessage}
            </div>
            <button type="button" onClick={closeError}>
              Försök igen
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
