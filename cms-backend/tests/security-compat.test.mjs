import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const { default: PluginLoader } = require(join(dirname(require.resolve('@oclif/core')), 'config/plugin-loader.js'));

test('patched matcher preserves Sanity CLI plugin discovery', async () => {
  const loader = new PluginLoader({ root: '/fixture' });
  const calls = [];
  loader.loadPlugins = async (root, type, names) => calls.push({root, type, names});
  await loader.loadCorePlugins({ rootPlugin: {
    root: '/fixture',
    pjson: {
      dependencies: { '@sanity/workflow-cli': '1', '@sanity/workbench-cli': '1', '@oclif/plugin-help': '1', 'unrelated-package': '1' },
      oclif: { plugins: ['@sanity/*', '@oclif/plugin-*'] },
    },
  } });
  assert.deepEqual(calls.flatMap(call => call.names), ['@sanity/workflow-cli', '@sanity/workbench-cli', '@oclif/plugin-help']);
});
