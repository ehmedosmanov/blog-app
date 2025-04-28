const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https', 
        hostname: 'blog-app-production-b40c.up.railway.app',
        port: '',
        pathname: '/uploads/**', 
      },

    ],
  },
};

export default nextConfig;
