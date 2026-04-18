/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://quasar082.github.io',
  generateRobotsTxt: true,
  outDir: './out',
  trailingSlash: true,
  exclude: ['/404', '/404/'],
  robotsTxtOptions: {
    policies: [{userAgent: '*', allow: '/'}],
  },
};
