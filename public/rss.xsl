<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="utf-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/rss/channel">
    <html lang="id">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title><xsl:value-of select="title"/> — RSS Feed</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}
        .wrap{max-width:680px;margin:0 auto;padding:48px 20px}
        .head{text-align:center;margin-bottom:40px}
        .head h1{font-size:28px;font-weight:800;letter-spacing:-.5px;margin-bottom:8px}
        .head .gradient{background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .head p{font-size:14px;color:#64748b}
        .subscribe{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 0 0;padding:10px 18px;background:#1e293b;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;width:fit-content;margin-left:auto;margin-right:auto}.subscribe:hover{opacity:.85}
        .item{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:12px;transition:box-shadow .2s}
        .item:hover{box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .item h2{font-size:16px;font-weight:700;margin-bottom:6px}
        .item h2 a{color:#0f172a;text-decoration:none}.item h2 a:hover{color:#6366f1}
        .item .date{font-size:12px;color:#94a3b8;margin-bottom:8px}
        .item .desc{font-size:13px;color:#475569;white-space:pre-line}
        .footer{text-align:center;margin-top:32px;font-size:12px;color:#94a3b8}
        @media(prefers-color-scheme:dark){
          body{background:#0f172a;color:#e2e8f0}
          .item{background:#1e293b;border-color:#334155}
          .item:hover{box-shadow:0 2px 12px rgba(255,255,255,.04)}
          .item h2 a{color:#f1f5f9}.item h2 a:hover{color:#818cf8}
          .item .date{color:#64748b}
          .item .desc{color:#94a3b8}
          .subscribe{background:#fff;color:#0f172a}
          .footer{color:#64748b}
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="head">
          <h1><xsl:value-of select="title"/></h1>
          <p><xsl:value-of select="description"/></p>
          <a class="subscribe" href="{atom:link[@rel='self']/@href}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
            Subscribe via RSS
          </a>
        </div>
        <xsl:for-each select="item">
          <div class="item">
            <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
            <div class="date"><xsl:value-of select="pubDate"/></div>
            <div class="desc"><xsl:value-of select="description"/></div>
          </div>
        </xsl:for-each>
        <div class="footer">
          <xsl:value-of select="lastBuildDate"/> · ToolsAulia
        </div>
      </div>
    </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
