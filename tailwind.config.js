module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buttonbg: "#291f9e",
        buttontxt: "#ffffff",
        selectedtxt: "#291f9e",
        inputfocus: "#291f9e",
        st: {
          "dark-blue": "#292941",
          "light-blue": "#bcb3ff",
          "dark-orange": "#F4A60B",
        },
      },
    },
  },
  daisyui: {
    themes: false,
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
};
