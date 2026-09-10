import type { APIRoute } from 'astro';
import { tools } from '../data/tools';

/**
 * GET /search-tools.json
 *
 * Single shared search index for the command-palette search modal (BaseLayout).
 * Previously this data (~60KB) was inlined as <script type="application/json">
 * into EVERY page's HTML — ~14MB duplication across 233 pages in the build
 * output (and the same data re-downloaded on every page load).
 *
 * Now it is served once as a static file, fetched lazily by the search modal
 * on first interaction, and precached by the service worker for offline use.
 */
export const GET: APIRoute = () => {
  const searchTools = tools.map(t => ({
    name: t.title,
    url: t.href,
    category: t.category,
    descKey: t.descKey,
    descFallback: t.descFallback,
  }));

  return new Response(JSON.stringify(searchTools), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
};
