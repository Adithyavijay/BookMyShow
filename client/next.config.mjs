/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5010/api',
    BASE_URL : process.env.BASE_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
        hostname: process.env.NODE_ENV === 'development' ? 'localhost' : 'bookmyshow.entebuddy.in',
        port: process.env.NODE_ENV === 'development' ? '5010' : '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
