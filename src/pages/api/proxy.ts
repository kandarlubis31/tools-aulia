export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  // 1. Validasi Input
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Parameter URL wajib diisi' }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Biar error pun tetap bisa dibaca frontend
      }
    });
  }

  try {
    // 2. Validasi Format URL
    new URL(targetUrl);

    // 3. Fetch ke Target URL
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Aulia-Tools-Proxy/1.0', // Biar target tau ini bot kita
      },
    });

    // 4. Ambil Data sebagai Buffer (Bukan Text)
    // Ini penting agar support Gambar, PDF, dan file binary lainnya
    const data = await response.arrayBuffer();
    
    // Ambil Content-Type asli dari target (misal: application/json atau image/png)
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // 5. Kembalikan Response ke Browser
    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // KUNCI: Bypass CORS di sini
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Jangan cache hasil proxy
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    // 6. Handle Error (Misal URL mati atau timeout)
    return new Response(JSON.stringify({ 
      error: 'Terjadi kesalahan saat menghubungi target URL', 
      details: error instanceof Error ? error.message : String(error) 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  }
};