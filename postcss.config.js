// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// หรือใช้แบบนี้ถ้ามีปัญหา
// module.exports = {
//   plugins: [
//     require('tailwindcss'),
//     require('autoprefixer'),
//   ],
// }
