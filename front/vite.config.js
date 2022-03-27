import { defineConfig } from "vite"
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
//      "/api": "http://127.0.0.1:8000",
    },
  },
})
