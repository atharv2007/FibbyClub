import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
        data: ['Rethink Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        safe: {
          DEFAULT: "hsl(var(--safe))",
          foreground: "hsl(var(--safe-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        fibby: {
          bubble: "hsl(var(--fibby-bubble))",
          "bubble-foreground": "hsl(var(--fibby-bubble-foreground))",
          "avatar-bg": "hsl(var(--fibby-avatar-bg))",
          "avatar-icon": "hsl(var(--fibby-avatar-icon))",
        },
        user: {
          bubble: "hsl(var(--user-bubble))",
          "bubble-foreground": "hsl(var(--user-bubble-foreground))",
        },
        nav: {
          active: "hsl(var(--nav-active))",
          inactive: "hsl(var(--nav-inactive))",
        },
        chip: {
          bg: "hsl(var(--chip-bg))",
          border: "hsl(var(--chip-border))",
          text: "hsl(var(--chip-text))",
        },
        progress: {
          safe: "hsl(var(--progress-safe))",
          warning: "hsl(var(--progress-warning))",
          danger: "hsl(var(--progress-danger))",
        },
        widget: {
          bg: "hsl(var(--widget-bg))",
          border: "hsl(var(--widget-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        bubble: "1.25rem",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "typing": {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.4" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-left": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(-100%)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 1s ease-in-out infinite",
        "typing": "typing 1.4s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-out",
      },
      boxShadow: {
        "soft": "0 4px 20px -4px rgba(0,0,0,0.08)",
        "medium": "0 8px 30px -8px rgba(0,0,0,0.12)",
        "nav": "0 -4px 20px -4px rgba(0,0,0,0.08)",
        "widget": "0 4px 24px -4px rgba(0,0,0,0.08)",
        "fab": "0 4px 20px -2px rgba(150,104,102,0.4)",
        "glass": "0 8px 32px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;