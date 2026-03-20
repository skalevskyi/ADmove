/**
 * Optional prefix for URLs to files under `public/`.
 * Root deploy: leave unset (empty string). Set `NEXT_PUBLIC_BASE_PATH` only if the app is served under a subpath.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Builds a URL to a file under `public/` (e.g. `public/logo/x.png` → `/logo/x.png` when `BASE_PATH` is empty).
 *
 * @param path - Path beginning with `/` (e.g. `/logo/favicon.svg`)
 */
export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
