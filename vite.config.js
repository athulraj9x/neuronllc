import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "user-profile-form", replacement: "/packages/user-profile-form/src" },
      { find: "user-list", replacement: "/packages/user-list/src" }
    ]
  }
});
