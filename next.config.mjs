/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // This handles the transition from your old brand naming conventions
        source: '/old-path-example', 
        destination: '/', 
        permanent: true, // This is critical for SEO to signal a permanent move
      },
    ];
  },
};

export default nextConfig;
