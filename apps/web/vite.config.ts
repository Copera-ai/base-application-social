import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

const PORT = 8081;

export default defineConfig({
  envDir: __dirname,
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'build'),
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@components',
        replacement: path.resolve(process.cwd(), 'src/components'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
