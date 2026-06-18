/**
 * ToolsAulia - Shared Tool Definitions
 * Single source of truth for all tool data.
 * Imported by index.astro (grid) and BaseLayout.astro (search modal).
 */

export interface ToolDefinition {
  /** Category id (pdf, image, dev, calc, security, file, utils) */
  cat: string;
  /** Whether this tool appears in the "Popular" section on homepage */
  popular: boolean;
  /** i18n key for the tool title */
  titleKey: string;
  /** Display name (Indonesian fallback) */
  title: string;
  /** i18n key for the tool description */
  descKey: string;
  /** Description text (Indonesian fallback) */
  desc: string;
  /** URL path */
  href: string;
  /** Theme color */
  color: string;
  /** SVG path data for the icon */
  icon: string;
  /** Display category name for search (e.g. "PDF", "Image") */
  category: string;
  /** Same as desc — used as fallback in search */
  descFallback: string;
}

export const tools: ToolDefinition[] = [
  // ==================== PDF TOOLS ====================
  // Special: PDF hub page (links to /pdf, not a specific tool)
  { cat: "pdf", popular: true, titleKey: "tool.pdf_mas_aul", title: "PDF Mas Aul", descKey: "tool.pdf_mas_aul_desc", desc: "Satu tempat untuk semua kebutuhan PDF.", href: "/pdf", color: "rose", category: "PDF", descFallback: "Satu tempat untuk semua kebutuhan PDF.", icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },

  { cat: "pdf", popular: false, titleKey: "tool.merge_pdf", title: "Merge PDF", descKey: "tool.merge_pdf_desc", desc: "Gabungkan banyak file PDF.", href: "/pdf/merge", color: "rose", category: "PDF", descFallback: "Gabungkan banyak file PDF menjadi satu", icon: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.split_pdf", title: "Split PDF", descKey: "tool.split_desc", desc: "Pisah file PDF menjadi beberapa bagian.", href: "/pdf/split", color: "orange", category: "PDF", descFallback: "Pisah file PDF menjadi beberapa bagian", icon: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.compress_pdf", title: "Compress PDF", descKey: "tool.compress_pdf_desc", desc: "Kecilkan ukuran file PDF.", href: "/pdf/compress", color: "emerald", category: "PDF", descFallback: "Kompres ukuran file PDF", icon: '<path d="M4 14l6 6 6-6"/><path d="M12 20v-9"/><path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.delete_pages", title: "Delete Pages", descKey: "tool.delete_desc", desc: "Hapus halaman dari PDF.", href: "/pdf/delete", color: "rose", category: "PDF", descFallback: "Hapus halaman dari PDF", icon: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.extract_pages", title: "Extract Pages", descKey: "tool.extract_desc", desc: "Ekstrak halaman tertentu dari PDF.", href: "/pdf/extract", color: "violet", category: "PDF", descFallback: "Ekstrak halaman tertentu dari PDF", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M12 18V12"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.rotate_pdf", title: "Rotate PDF", descKey: "tool.rotate_desc", desc: "Putar halaman PDF.", href: "/pdf/rotate", color: "sky", category: "PDF", descFallback: "Putar halaman PDF", icon: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v5h-5"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.grayscale", title: "Grayscale", descKey: "tool.grayscale_desc", desc: "Ubah PDF menjadi grayscale.", href: "/pdf/grayscale", color: "slate", category: "PDF", descFallback: "Ubah PDF menjadi grayscale", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.pdf_to_jpg", title: "PDF to JPG", descKey: "tool.pdf_to_jpg_desc", desc: "Ubah halaman PDF jadi gambar.", href: "/pdf/to-jpg", color: "yellow", category: "PDF", descFallback: "Konversi PDF ke gambar JPG", icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.jpg_to_pdf", title: "JPG to PDF", descKey: "tool.jpg_to_pdf_desc", desc: "Konversi gambar JPG ke PDF.", href: "/pdf/jpg-to-pdf", color: "cyan", category: "PDF", descFallback: "Konversi gambar JPG ke PDF", icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="11 3 11 11 14 8 17 11 17 3"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.html_to_pdf", title: "HTML to PDF", descKey: "tool.html_to_pdf_desc", desc: "Konversi HTML ke PDF.", href: "/pdf/html-to-pdf", color: "indigo", category: "PDF", descFallback: "Konversi HTML ke PDF", icon: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.to_ppt", title: "PDF to PPT", descKey: "tool.to_ppt_desc", desc: "Konversi PDF ke PowerPoint.", href: "/pdf/to-ppt", color: "orange", category: "PDF", descFallback: "Konversi PDF ke PowerPoint", icon: '<path d="M4 4h16v16H4z"/><path d="M8 12h8"/><path d="M8 8h8"/><path d="M8 16h5"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.sign_pdf", title: "Sign PDF", descKey: "tool.sign_desc", desc: "Tanda tangan file PDF.", href: "/pdf/sign", color: "blue", category: "PDF", descFallback: "Tanda tangan file PDF", icon: '<path d="M11 12H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/><path d="M18 8V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3"/><path d="M18 21v-3"/><path d="M22 18h-4"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.watermark", title: "Watermark", descKey: "tool.watermark_desc", desc: "Tambah cap air di dokumen.", href: "/pdf/watermark", color: "amber", category: "PDF", descFallback: "Tambah watermark ke PDF", icon: '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.metadata", title: "Metadata", descKey: "tool.metadata_desc", desc: "Lihat & edit metadata PDF.", href: "/pdf/metadata", color: "purple", category: "PDF", descFallback: "Lihat dan edit metadata PDF", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.page_numbers", title: "Page Numbers", descKey: "tool.page_numbers_desc", desc: "Tambah nomor halaman PDF.", href: "/pdf/page-numbers", color: "green", category: "PDF", descFallback: "Tambah nomor halaman PDF", icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>' },
  { cat: "pdf", popular: false, titleKey: "tool.reorder_pdf", title: "Reorder PDF", descKey: "tool.reorder_desc", desc: "Atur ulang halaman PDF.", href: "/pdf/reorder", color: "teal", category: "PDF", descFallback: "Atur ulang halaman PDF", icon: '<path d="m9 10 3-3 3 3"/><path d="m9 14 3 3 3-3"/><path d="M12 7v10"/>' },

  // ==================== IMAGE TOOLS ====================
  { cat: "image", popular: true, titleKey: "tool.studio_editor", title: "Studio Editor", descKey: "tool.studio_editor_desc", desc: "Edit foto, filter, crop, & grading.", href: "/image/editor", color: "pink", category: "Image", descFallback: "Edit gambar sederhana", icon: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
  { cat: "image", popular: true, titleKey: "tool.image_compressor", title: "Image Compressor", descKey: "tool.image_compressor_desc", desc: "Kecilkan ukuran gambar.", href: "/image/compressor", color: "emerald", category: "Image", descFallback: "Kompres gambar tanpa upload", icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="11 3 11 11 14 8 17 11 17 3"/><path d="m21 15-5-5L5 21"/>' },
  { cat: "image", popular: false, titleKey: "tool.image_converter", title: "Image Converter", descKey: "tool.image_converter_desc", desc: "Ubah format PNG/JPG/WEBP.", href: "/image/converter", color: "sky", category: "Image", descFallback: "Konversi format gambar", icon: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>' },
  { cat: "image", popular: false, titleKey: "tool.color_picker", title: "Color Picker", descKey: "tool.color_picker_desc", desc: "Ambil warna dari gambar.", href: "/image/color", color: "pink", category: "Image", descFallback: "Picker dan konversi warna", icon: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="22"/><line x1="2" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="22" y2="12"/>' },
  { cat: "image", popular: false, titleKey: "tool.html_to_image", title: "HTML to Image", descKey: "tool.html_to_image_desc", desc: "Convert kode HTML jadi gambar.", href: "/image/html-to-img", color: "pink", category: "Image", descFallback: "Konversi HTML ke gambar", icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },

  // ==================== CALCULATOR TOOLS ====================
  { cat: "calc", popular: true, titleKey: "tool.currency_calc", title: "Currency Calc", descKey: "tool.currency_calc_desc", desc: "Kurs mata uang live.", href: "/calc/currency", color: "emerald", category: "Calc", descFallback: "Konversi mata uang", icon: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { cat: "calc", popular: true, titleKey: "tool.age_calculator", title: "Age Calculator", descKey: "tool.age_calculator_desc", desc: "Hitung umur detail.", href: "/calc/age", color: "blue", category: "Calc", descFallback: "Hitung umur detail", icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { cat: "calc", popular: true, titleKey: "tool.bmi_calculator", title: "BMI Calculator", descKey: "tool.bmi_calculator_desc", desc: "Cek berat badan ideal.", href: "/calc/bmi", color: "teal", category: "Calc", descFallback: "Hitung indeks massa tubuh", icon: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>' },
  { cat: "calc", popular: false, titleKey: "tool.unit_converter", title: "Unit Converter", descKey: "tool.unit_converter_desc", desc: "Konversi satuan.", href: "/calc/unit", color: "lime", category: "Calc", descFallback: "Konversi satuan", icon: '<path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><path d="M14 6v14"/><path d="M8 6v14"/>' },
  { cat: "calc", popular: false, titleKey: "tool.number_base", title: "Number Base", descKey: "tool.number_base_desc", desc: "Bin/Oct/Dec/Hex.", href: "/calc/number", color: "cyan", category: "Calc", descFallback: "Konversi angka", icon: '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a3 3 0 0 1 0 6h-4a3 3 0 0 1 0-6h4Z"/><path d="M19 18a3 3 0 0 1 0-6h-4a3 3 0 0 1 0 6h4Z"/>' },
  { cat: "calc", popular: false, titleKey: "tool.percentage_calc", title: "Percentage Calculator", descKey: "tool.percentage_desc", desc: "Kalkulator persentase.", href: "/calc/percentage", color: "pink", category: "Calc", descFallback: "Kalkulator persentase", icon: '<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' },
  { cat: "calc", popular: false, titleKey: "tool.case_converter", title: "Case Converter", descKey: "tool.case_desc", desc: "Ubah huruf besar/kecil.", href: "/calc/case", color: "sky", category: "Calc", descFallback: "Ubah huruf besar/kecil", icon: '<path d="M4 20h16"/><path d="M4 10l4-8 4 8"/><path d="m14 10 4 8 4-8"/><path d="M4 16h16"/>' },

  // ==================== DEVELOPER TOOLS ====================
  { cat: "dev", popular: true, titleKey: "tool.my_ip", title: "My IP Address", descKey: "tool.my_ip_desc", desc: "Cek IP Public & ISP.", href: "/dev/my-ip", color: "blue", category: "Dev", descFallback: "Cek IP dan info jaringan", icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { cat: "dev", popular: false, titleKey: "tool.json_formatter", title: "JSON Formatter", descKey: "tool.json_formatter_desc", desc: "Rapikan kode JSON.", href: "/dev/json", color: "amber", category: "Dev", descFallback: "Format dan validasi JSON", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1"/><path d="M14 12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1"/>' },
  { cat: "dev", popular: false, titleKey: "tool.cors_proxy", title: "CORS Proxy", descKey: "tool.cors_proxy_desc", desc: "Bypass CORS browser.", href: "/dev/proxy", color: "violet", category: "Dev", descFallback: "Tes proxy", icon: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  { cat: "dev", popular: false, titleKey: "tool.base64_tool", title: "Base64 Tool", descKey: "tool.base64_tool_desc", desc: "Encode/decode Base64.", href: "/dev/base64", color: "orange", category: "Dev", descFallback: "Encode/decode Base64", icon: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>' },
  { cat: "dev", popular: false, titleKey: "tool.cron_generator", title: "Cron Generator", descKey: "tool.cron_generator_desc", desc: "Buat jadwal Cron Job.", href: "/dev/cron", color: "orange", category: "Dev", descFallback: "Generator ekspresi cron", icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
  { cat: "dev", popular: false, titleKey: "tool.url_encoder", title: "URL Encoder", descKey: "tool.url_encoder_desc", desc: "Encode parameter URL.", href: "/dev/url", color: "teal", category: "Dev", descFallback: "Encode/decode URL", icon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
  { cat: "dev", popular: false, titleKey: "tool.markdown_editor", title: "Markdown Editor", descKey: "tool.markdown_editor_desc", desc: "Tulis & preview MD.", href: "/dev/markdown", color: "gray", category: "Dev", descFallback: "Editor markdown live", icon: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>' },
  { cat: "dev", popular: false, titleKey: "tool.diff_checker", title: "Diff Checker", descKey: "tool.diff_checker_desc", desc: "Bandingkan dua teks.", href: "/dev/diff", color: "orange", category: "Dev", descFallback: "Bandingkan teks", icon: '<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5 5"/><path d="M4 4l5 5"/>' },
  { cat: "dev", popular: false, titleKey: "tool.timestamp_conv", title: "Timestamp Conv.", descKey: "tool.timestamp_conv_desc", desc: "Unix timestamp ke tanggal.", href: "/dev/timestamp", color: "violet", category: "Dev", descFallback: "Konversi timestamp", icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  { cat: "dev", popular: false, titleKey: "tool.css_shadow", title: "CSS Shadow", descKey: "tool.css_shadow_desc", desc: "Generator box-shadow.", href: "/dev/css-shadow", color: "pink", category: "Dev", descFallback: "Generator box-shadow CSS", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M22 22 2 2"/>' },


  // ==================== SECURITY TOOLS ====================
  { cat: "security", popular: true, titleKey: "tool.password_gen", title: "Password Gen", descKey: "tool.password_gen_desc", desc: "Buat password kuat.", href: "/security/password", color: "emerald", category: "Security", descFallback: "Generator password kuat", icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  { cat: "security", popular: false, titleKey: "tool.hash_generator", title: "Hash Generator", descKey: "tool.hash_generator_desc", desc: "MD5, SHA-1, SHA-256.", href: "/security/hash", color: "blue", category: "Security", descFallback: "Generate hash MD5/SHA", icon: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>' },
  { cat: "security", popular: false, titleKey: "tool.uuid_generator", title: "UUID Generator", descKey: "tool.uuid_generator_desc", desc: "Buat Unique ID.", href: "/security/uuid", color: "purple", category: "Security", descFallback: "Generate UUID", icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/>' },

  // ==================== FILE TOOLS ====================
  { cat: "file", popular: false, titleKey: "tool.csv_to_json", title: "CSV to JSON", descKey: "tool.csv_to_json_desc", desc: "Ubah CSV/Excel ke JSON.", href: "/file/csv-json", color: "blue", category: "File", descFallback: "Konversi CSV ke JSON", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13 2 2 2-2"/><path d="M12 18v-5"/>' },
  { cat: "file", popular: true, titleKey: "tool.pdf_to_markdown", title: "PDF to Markdown", descKey: "tool.pdf_to_markdown_desc", desc: "Ekstrak teks PDF jadi Markdown.", href: "/file/pdf-to-md", color: "orange", category: "File", descFallback: "Ekstrak teks PDF ke Markdown", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>' },

  // ==================== UTILITY TOOLS ====================
  { cat: "utils", popular: true, titleKey: "tool.wa_link_builder", title: "WA Link Builder", descKey: "tool.wa_link_builder_desc", desc: "Buat link WA dengan style.", href: "/utils/wa-builder", color: "emerald", category: "Utils", descFallback: "Buat link WhatsApp", icon: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { cat: "utils", popular: true, titleKey: "tool.qr_generator", title: "QR Generator", descKey: "tool.qr_generator_desc", desc: "Buat QR code instan.", href: "/utils/qr", color: "indigo", category: "Utils", descFallback: "Buat QR Code", icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
  { cat: "utils", popular: true, titleKey: "tool.dev_jokes", title: "Dev Jokes", descKey: "tool.dev_jokes_desc", desc: "Pembangkit mood coding.", href: "/utils/jokes", color: "cyan", category: "Utils", descFallback: "Kumpulan lelucon", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h.01"/><path d="M16 11h.01"/><path d="M9 16c1.5 1.5 4.5 1.5 6 0"/>' },
  { cat: "utils", popular: false, titleKey: "tool.brainstorm_facts", title: "Brainstorm Facts", descKey: "tool.brainstorm_facts_desc", desc: "Generator ide & fakta.", href: "/utils/brainstorm", color: "amber", category: "Utils", descFallback: "Generator ide dan fakta", icon: '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548 5.478A1 1 0 0 1 14.458 22H9.542a1 1 0 0 1-.995-.91l-.548-5.478z"/>' },
  { cat: "utils", popular: false, titleKey: "tool.pomodoro_timer", title: "Pomodoro Timer", descKey: "tool.pomodoro_timer_desc", desc: "Timer fokus kerja.", href: "/utils/pomodoro", color: "rose", category: "Utils", descFallback: "Timer produktivitas", icon: '<path d="M12 2a10 10 0 1 0 10 10h-10V2z"/>' },
  { cat: "utils", popular: false, titleKey: "tool.todo_list", title: "Todo List", descKey: "tool.todo_list_desc", desc: "Catatan tugas simpel.", href: "/utils/todo", color: "violet", category: "Utils", descFallback: "Aplikasi todo list", icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
  { cat: "utils", popular: false, titleKey: "tool.word_counter", title: "Word Counter", descKey: "tool.word_counter_desc", desc: "Hitung kata & karakter.", href: "/utils/word-counter", color: "pink", category: "Utils", descFallback: "Hitung kata dan karakter", icon: '<path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M4 22h12"/>' },
  { cat: "utils", popular: true, titleKey: "tool.prabowo_countdown", title: "Countdown 2029", descKey: "tool.prabowo_countdown_desc", desc: "Hitung mundur ganti presiden! 🎉", href: "/utils/prabowo-countdown", color: "red", category: "Utils", descFallback: "Hitung mundur ganti presiden!", icon: '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M15.5 8.5v.01"/><path d="M9 14a6 6 0 0 0 6 0"/>' },
  { cat: "utils", popular: true, titleKey: "tool.paste_to_md", title: "Paste to Markdown", descKey: "tool.paste_to_md_desc", desc: "Tempel teks, dapatkan MD bersih.", href: "/utils/paste-to-md", color: "emerald", category: "Utils", descFallback: "Tempel teks, dapatkan Markdown bersih buat AI", icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4h-4V2"/><path d="M10 14l2 2 4-4"/>' },
  { cat: "utils", popular: false, titleKey: "tool.stopwatch", title: "Stopwatch", descKey: "tool.stopwatch_desc", desc: "Penghitung waktu.", href: "/utils/stopwatch", color: "cyan", category: "Utils", descFallback: "Stopwatch sederhana", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M10 2h4"/><polyline points="12 6 12 12 16 14"/>' },
  { cat: "utils", popular: false, titleKey: "tool.lorem_ipsum", title: "Lorem Ipsum", descKey: "tool.lorem_desc", desc: "Generator teks dummy.", href: "/utils/lorem", color: "slate", category: "Utils", descFallback: "Generator teks dummy", icon: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>' },
  { cat: "utils", popular: false, titleKey: "tool.motivation", title: "Motivation", descKey: "tool.motivation_desc", desc: "Kutipan motivasi.", href: "/utils/motivation", color: "violet", category: "Utils", descFallback: "Kutipan motivasi", icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 12V6"/><path d="M9 15l3 3 3-3"/>' },
  { cat: "utils", popular: true, titleKey: "tool.sinonim", title: "Persamaan Kata", descKey: "tool.sinonim_desc", desc: "Cari sinonim & antonim kata.", href: "/utils/sinonim", color: "sky", category: "Utils", descFallback: "Cari persamaan kata dan lawan kata", icon: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/><polyline points="10 6 14 10 10 14"/>' },
];

/** Category display name mapping */
export const categoryNames: Record<string, string> = {
  pdf: "PDF",
  image: "Image",
  calc: "Calc",
  dev: "Dev",
  security: "Security",
  file: "File",
  utils: "Utils",
};

/** All unique category ids */
export const categoryIds = [...new Set(tools.map(t => t.cat))];
