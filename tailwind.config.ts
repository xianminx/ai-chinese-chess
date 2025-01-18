import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px) rotate(1deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)', textShadow: '0 0 10px rgba(220,38,38,0.5)' },
          '20%': { transform: 'translate(-3px, 3px)', textShadow: '-3px 3px 10px rgba(220,38,38,0.5)' },
          '40%': { transform: 'translate(-3px, -3px)', textShadow: '-3px -3px 10px rgba(220,38,38,0.5)' },
          '60%': { transform: 'translate(3px, 3px)', textShadow: '3px 3px 10px rgba(220,38,38,0.5)' },
          '80%': { transform: 'translate(3px, -3px)', textShadow: '3px -3px 10px rgba(220,38,38,0.5)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        bounce: 'bounce 1s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite',
        glitch: 'glitch 0.3s cubic-bezier(.36,.07,.19,.97) infinite',
      },
      dropShadow: {
        'glow': '0 0 10px rgba(220,38,38,0.5)',
      }
    },
  },
  plugins: [nextui()],
};

export default config;
