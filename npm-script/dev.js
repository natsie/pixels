import { spawn } from "node:child_process";

const tscompiler = spawn("npx", ["tsc", "--watch"], { shell: true });
console.log(`Successfully started TypeScript compiler, pid ${tscompiler.pid}`);
