import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'cred': '#F66157',
        'cyellow': '#F6D04F',
        'cgreen': '#5CD79C',
        'cnavy': '#29427A',
        'cblue': '#3983BB',
        'cblue-light': '#4068F5'
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["pastel"],
  },
};
export default config;
