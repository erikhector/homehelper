import { useState } from "react";
import { useError } from "@dekiru/react-error-boundary";

import { getHelloWorld, throwNewProblemDetails } from "Src/api/Placeholder";

import PlaceholderImg from "Src/assets/placeholder-to-delete.png";

export default function TemplateShowcase() {
  const dispatchError = useError();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const loadData = async () => {
    setLoading(true);
    const response = await getHelloWorld();
    setResponse(response);
    setLoading(false);
  };

  const backendError = async () => {
    try {
      setLoading(true);
      await throwNewProblemDetails();
      setLoading(false);
    } catch (error) {
      dispatchError(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "933px"
      }}
    >
      <h1 style={{ margin: 0 }}>Home</h1>
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong>Template info</strong>
        <p style={{ margin: 0 }}>
          This is a customized vitejs template. This is a show case of template things. Make sure to delete this self contained component in new
          projects.
        </p>
      </div>
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong>Response from backend</strong>
        <button disabled={loading} type="button" onClick={loadData}>
          Trigger API call to load data
        </button>
        {loading ? <p style={{ margin: 0 }}>Loading...</p> : <p style={{ margin: 0 }}>{response}</p>}
      </div>
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong>Importing and rendering an image</strong>
        <img alt="Grey lines of varying lengths" src={PlaceholderImg} style={{ width: "60%" }} />
      </div>
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong>Error handling</strong>
        <button type="button" onClick={() => dispatchError("This is an error message")}>
          Trigger a CLIENT error using hook useError to show error boundary
        </button>
        <button type="button" onClick={backendError}>
          Trigger a BACKEND Problem Details error to show error boundary
        </button>
      </div>
    </div>
  );
}
