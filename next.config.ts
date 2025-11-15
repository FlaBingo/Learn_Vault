import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'vocaberry.com'
      },
      {
        protocol: 'https',
        hostname: 'englishforyourself.com'
      },
      {
        protocol: 'https',
        hostname: 'englishgrammarzone.com'
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com'
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ]
  }
};

export default nextConfig;
