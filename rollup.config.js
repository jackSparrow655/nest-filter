import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      preserveModules: true,
      sourcemap: true
    }
  ],
  external: [
    "react",
    "react-dom",
    "tailwindcss",
    "lucide-react"
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json"
    })
  ]
});
