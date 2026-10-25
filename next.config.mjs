/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'certificate.thepickleballscoreboard.com',
            // port: '',
            // pathname: '/account123/**',
          },
          {
            protocol: 'http',
            hostname: 'certificate.thepickleballscoreboard.com',
          },
        ],
      },
      serverExternalPackages: ['@react-pdf/renderer'],

};

export default nextConfig;
