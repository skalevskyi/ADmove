const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = function registerTypeScript(module, filename) {
  const source = require('node:fs').readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });

  module._compile(output.outputText, filename);
};

require(path.resolve(__dirname, '../src/lib/calculator/__tests__/calculator-engine.test.ts'));
require(path.resolve(__dirname, '../src/components/trajets/__tests__/trajets-proof.test.ts'));
