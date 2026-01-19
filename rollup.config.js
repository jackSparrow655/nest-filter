import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss"


export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "esm",
      preserveModules: true,
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "tailwindcss", "lucide-react"],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    postcss({
      extract: true,        // ⬅️ creates dist/index.css
      minimize: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
});
