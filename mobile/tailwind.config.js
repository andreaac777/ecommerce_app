/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#C34928",
          secondary: "#5B3A29",
          accent: "#F4CE14",
        },
        ui: {
          background: "#F4F4F4",
          surface: "#FFFFFF",
          border: "#999999",
        },
        text: {
          primary: "#333333",
          secondary: "#666666",
          muted: "#999999",
          inverse: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}

