import { esbuildDecorators } from "@anatine/esbuild-decorators";

export default {
  tsConfigFile: "./tsconfig.json",
  esbuild: {
    minify: false,
    target: "ES2023",
    plugins: [esbuildDecorators()],
    format: "esm",
  },
  prebuild: async () => {
    const rimraf = (await import("rimraf")).default;
    rimraf.sync("./dist");
  },
};
