import { Helmet } from "react-helmet-async";

export default function Index() {
  return (
    <>
      <Helmet title="About" />
      <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "933px" }}>
        <h1>About</h1>
      </div>
    </>
  );
}
