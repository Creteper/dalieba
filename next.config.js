/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-03-20 20:19:27
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-16 16:58:49
 * @FilePath: \dalieba\next.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript : {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-blog.csdnimg.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.3.6',
        port: '5000',
        pathname: '/api/img/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
        port: '',
        pathname: '/styles/v1/mapbox/**',
      },
    ],
  },
}

module.exports = nextConfig;
