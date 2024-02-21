// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "@": resolve(__dirname, "/"),
  },
  css: ["~/assets/main.css"],

  nitro: {
    plugins: ["~/server/index.ts"],
  },

  runtimeConfig: {
    // mongodbUri: process.env.MONGODB_URI,
    mongodbUri: "mongodb://127.0.0.1:27017/nitro",
  },
});
