import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(dirname(fileURLToPath(import.meta.url)), 'src');
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript"]
  }
};

export default nextConfig;
