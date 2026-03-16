/**
 * Base path for static assets.
 * In dev we serve from root (/), in production from /ADmove (GitHub Pages).
 * Must stay in sync with next.config.ts basePath / assetPrefix.
 */
const isProd = process.env.NODE_ENV === 'production';

export const BASE_PATH = isProd ? '/ADmove' : '';
