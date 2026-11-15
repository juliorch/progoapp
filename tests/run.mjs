import { build } from 'esbuild';
import { mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await mkdir('.test-output',{recursive:true});
try {
 await build({entryPoints:['tests/store.test.ts'],outfile:'.test-output/store.mjs',bundle:true,platform:'node',format:'esm',target:'node20'});
 const result=spawnSync(process.execPath,['.test-output/store.mjs'],{stdio:'inherit'});
 process.exitCode=result.status??1;
} finally {await rm('.test-output',{recursive:true,force:true});}
