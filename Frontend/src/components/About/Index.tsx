import { Helmet } from "react-helmet-async";

export default function Index() {
  return (
    <>
      <Helmet title="Om HomeHelper" />
      <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "933px" }}>
        <h1>Om HomeHelper</h1>
      </div>
    </>
  );
}
