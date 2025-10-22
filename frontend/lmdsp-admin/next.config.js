/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    // disable cache in dev to avoid “invalid block type” and rename errors
    if (dev) config.cache = false;
    // make @ point to src
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};
