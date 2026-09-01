export default function transformer(file, api, options) {
  const j = api.jscodeshift.withParser("ts");
  const root = j(file.source);

  // Array of env variable names to add
  const envVars = options.envVars || ["TEST"];

  // Find ImportMetaEnv interface
  const importMetaEnvInterface = root.find(j.TSInterfaceDeclaration, {
    id: { name: "ImportMetaEnv" }
  });

  // Helper to create a TS property signature
  const createProp = (name) => {
    const prop = j.tsPropertySignature(
      j.identifier(name),
      j.tsTypeAnnotation(j.tsStringKeyword()),
      true // optional
    );
    prop.readonly = true;
    return prop;
  };

  if (importMetaEnvInterface.size() > 0) {
    // Interface exists, add missing properties
    const props = importMetaEnvInterface.get().node.body.body;
    const existingNames = new Set(props.map((p) => p.key.name));
    envVars.forEach((name) => {
      if (!existingNames.has(name)) {
        props.push(createProp(name));
      }
    });
  } else {
    // Interface does not exist, create it only if envVars is non-empty
    const props = envVars.map(createProp).filter(Boolean);
    if (props.length > 0) {
      const interfaceDecl = j.tsInterfaceDeclaration.from({
        id: j.identifier("ImportMetaEnv"),
        typeParameters: undefined,
        extends: [],
        body: j.tsInterfaceBody(props)
      });
      root.get().node.program.body.push(interfaceDecl);
    }
  }

  return root.toSource();
}
