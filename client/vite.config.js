import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "https://estate-lake.vercel.app/",
                secure: false,
            },
        },
    },

    plugins: [react()],
});
