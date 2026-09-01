export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Remove imports for React, StrictMode, and ReactDOM
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const val = path.value.source.value;
      return val === "react" || val === "react-dom/client";
    })
    .remove();

  // Remove import "./ServiceWorker";
  root.find(j.ImportDeclaration, { source: { value: "./ServiceWorker" } }).remove();

  // Remove ReactDOM.createRoot(...).render(...) and keep its children
  let renderChildren = null;
  root.find(j.ExpressionStatement).forEach((path) => {
    const expr = path.value.expression;
    if (
      expr &&
      expr.type === "CallExpression" &&
      expr.callee &&
      expr.callee.type === "MemberExpression" &&
      expr.callee.object &&
      expr.callee.object.type === "CallExpression" &&
      expr.callee.object.callee.type === "MemberExpression" &&
      expr.callee.object.callee.object.name === "ReactDOM" &&
      expr.callee.object.callee.property.name === "createRoot" &&
      expr.callee.property.name === "render"
    ) {
      // The argument to render() should be a JSXElement
      const jsxArg = expr.arguments[0];
      if (jsxArg && (jsxArg.type === "JSXElement" || jsxArg.type === "JSXFragment")) {
        renderChildren = jsxArg.children;
      }
      j(path).remove();
    }
  });

  // Remove <StrictMode> but keep its children
  if (renderChildren) {
    renderChildren = renderChildren.flatMap((child) => {
      if (child.type === "JSXElement" && child.openingElement.name && child.openingElement.name.name === "StrictMode") {
        return child.children;
      }
      return child;
    });
  }

  // Remove all specified if blocks
  root.find(j.IfStatement).forEach((path) => {
    const testSrc = j(path.value.test).toSource();
    if (
      testSrc.includes('import.meta.env.NODE_ENV === "development"') &&
      (testSrc.includes("WP_REACT_SCAN") || testSrc.includes("REACT_AXE") || (!testSrc.includes("WP_REACT_SCAN") && !testSrc.includes("REACT_AXE")))
    ) {
      j(path).remove();
    }
  });

  // Remove all specified if blocks
  root.find(j.IfStatement).forEach((path) => {
    const testSrc = j(path.value.test).toSource();
    if (testSrc.includes('import.meta.env.NODE_ENV !== "production"')) {
      j(path).remove();
    }
  });

  // Add export default function App() { return JSX }; Only use fragment if multiple sibling children
  if (renderChildren) {
    const filteredChildren = renderChildren.filter(
      (child) =>
        child && (child.type === "JSXElement" || child.type === "JSXFragment" || child.type === "JSXExpressionContainer" || child.type === "Literal")
    );
    // Remove whitespace-only JSXText nodes
    const nonWhitespaceChildren = filteredChildren.filter((child) => !(child.type === "JSXText" && child.value.trim() === ""));
    let returnNode;
    if (nonWhitespaceChildren.length === 1) {
      returnNode = nonWhitespaceChildren[0];
    } else {
      returnNode = j.jsxFragment(j.jsxOpeningFragment(), j.jsxClosingFragment(), nonWhitespaceChildren);
    }
    const appFunc = j.exportDefaultDeclaration(j.functionDeclaration(j.identifier("App"), [], j.blockStatement([j.returnStatement(returnNode)])));
    root.get().node.program.body.push(appFunc);
  }

  return root.toSource();
}
