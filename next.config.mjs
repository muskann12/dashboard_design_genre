/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    ADMIN_PANNEL_PASSWORD: process.env.ADMIN_PANNEL_PASSWORD,
    ADMIN_PANNEL_EMAIL: process.env.ADMIN_PANNEL_EMAIL,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  },
};

export default nextConfig;
