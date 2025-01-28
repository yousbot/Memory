import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Match all files in src directory
    "./src/app/**/*.{js,ts,jsx,tsx}", // Explicitly include the app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
