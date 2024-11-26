import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/localhost.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.cert")),
    },
    proxy: {
      "/psp": {
        target: "https://api.externalintegration.payex.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
