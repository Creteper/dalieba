/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-blog.csdnimg.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 