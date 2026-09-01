import { Helmet } from "react-helmet-async";

export default function Error404() {
  return (
    <>
      <Helmet title="Sidan hittades inte" />
      <h1>Sidan hittades inte</h1>
    </>
  );
}
