import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["../../apps/**/*.{js,ts,jsx,tsx}", "../../packages/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require("tailwindcss-animate")],
};
export default config;
