import type { APIRoute } from 'astro';
import { changelogEntries, changelogSlug } from '../data/changelog';

/**
 * RSS feed (D3) — auto-generated at build from the same data as /changelog.
 * Served at /rss.xml.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() || 'https://tools.paklubis.my.id').replace(/\/$/, '');
  const now = new Date().toUTCString();

  const items = changelogEntries
    .map((entry) => {
      const date = new Date(entry.date + 'T00:00:00').toUTCString();
      const title = `${entry.version} — ${entry.title}`;
      const desc = entry.items.map((item) => `• ${item}`).join('\n');
      const link = `${base}/changelog#${changelogSlug(entry.version)}`;
      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${entry.version}@${entry.date}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ToolsAulia — Changelog</title>
    <link>${base}/changelog</link>
    <description>Update terbaru ToolsAulia: tools baru, fitur, dan perbaikan.</description>
    <language>id-id</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
