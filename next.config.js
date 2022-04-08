// next.config.js
module.exports = {
  swcMinify: true, // SWC for minifying JavaScript up to 7x faster in next12 beta
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "unsplash.com"],
  },
};
