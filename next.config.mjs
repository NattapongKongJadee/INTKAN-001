/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    "@dopt/react-modal",
    "@dopt/react-theme",
    "@dopt/react-rich-text",
    "@dopt/core-theme",
    "@dopt/core-rich-text",
    "@dopt/react-checklist",
  ],
};

export default nextConfig;
