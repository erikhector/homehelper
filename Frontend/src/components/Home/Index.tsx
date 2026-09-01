import { Helmet } from "react-helmet-async";

import TemplateShowcase from "./TemplateShowcase";

export default function Index() {
  return (
    <>
      <Helmet title="Home" />
      <TemplateShowcase />
    </>
  );
}
