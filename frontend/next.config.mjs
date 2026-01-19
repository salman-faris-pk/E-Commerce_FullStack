/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname:'/dqqcpkeup/image/upload/**'
      },
    ],
    qualities:[100,75, 80],
  },
}

export default nextConfig
