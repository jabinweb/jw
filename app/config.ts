// This file contains project-wide configuration settings

export const staticPaths = [
  '/',
  '/services',
  '/pricing',
  '/portfolio',
  '/contact',
  '/blog',
];

export const dynamicPaths = [
  '/admin',
  '/admin/*',
];

// Control which routes are statically generated vs. server-rendered
export const generateStaticParams = {
  // Define which pages should be pre-rendered at build time
  static: staticPaths,
  // Define which pages should be server-rendered on demand
  dynamic: dynamicPaths
};
