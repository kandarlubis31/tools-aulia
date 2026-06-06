const fs = require('fs');

const filePath = 'src/layouts/BaseLayout.astro';
let content = fs.readFileSync(filePath, 'utf8');

// Find the exact end of _i18nPhrases object
const anchor = "      'Ketik pesan di sini...':'Type message here...',";
const idx = content.indexOf(anchor);
if (idx === -1) {
  console.log('Anchor not found');
  process.exit(1);
}

const insertPos = idx + anchor.length;

const newPhrases = [
  "\n      'Memuat PDF...':'Loading PDF...',",
  "\n      'Mengirim data ke Worker...':'Sending data to Worker...',",
  "\n      'Mohon upload file PNG!':'Please upload a PNG file!',",
  "\n      '⏳ Rendering...':'⏳ Rendering...',",
  "\n      'Maksimal (1.0)':'Maximum (1.0)',",
  "\n      'File terlalu besar. Maksimal ukuran file adalah 15MB.':'File too large. Maximum file size is 15MB.',",
  "\n      'Gagal memuat PDF. File mungkin rusak atau tidak didukung.':'Failed to load PDF. File may be corrupted or unsupported.',",
  "\n      'Halaman berhasil dihapus!':'Pages deleted successfully!',",
  "\n      'Download Terpilih':'Download Selected',",
  "\n      'Menyusun file PDF akhir...':'Assembling final PDF file...',",
  "\n      'Download PDF':'Download PDF',",
  "\n      'Gagal membuat PDF.':'Failed to create PDF.',",
  "\n      'Yakin ingin menghapus semua?':'Are you sure you want to delete all?',",
  "\n      'Menyimpan...':'Saving...',",
  "\n      'Simpan Perubahan':'Save Changes',",
  "\n      'Simpan Urutan Baru':'Save New Order',",
  "\n      'Gagal memuat PDF. File mungkin rusak.':'Failed to load PDF. File may be corrupted.',",
  "\n      'Belum ada tanda tangan yang ditempel!':'No signature has been pasted yet!',",
  "\n      'Berhasil! Dokumen ditandatangani.':'Success! Document signed.',",
  "\n      'Gagal memuat PDF.':'Failed to load PDF.',",
  "\n      'Harap upload file PDF!':'Please upload a PDF file!',",
  "\n      'Gagal memproses PDF. File mungkin rusak atau terpassword.':'Failed to process PDF. File may be corrupted or password protected.',",
  "\n      'Membuat file PowerPoint...':'Creating PowerPoint file...',",
  "\n      'Selesai! File terunduh.':'Done! File downloaded.',",
  "\n      'Gagal memproses file.':'Failed to process file.',",
  "\n      'Koneksi lambat, menggunakan data lokal':'Slow connection, using local data',",
  "\n      'Disimpan ke favorit!':'Saved to favorites!',",
  "\n      'Link & Teks disalin!':'Link & Text copied!',",
  "\n      'Hapus semua?':'Delete all?',",
  "\n      'Koneksi Stabil':'Stable Connection',",
  "\n      'Koneksi Terputus':'Connection Lost',",
  "\n      'Gagal translate. Coba lagi.':'Translation failed. Try again.',",
  "\n      'Joke disalin!':'Joke copied!',",
  "\n      'Link & Joke disalin!':'Link & Joke copied!',",
  "\n      'Hapus semua joke favorit?':'Delete all favorite jokes?',",
  "\n      'QR Code belum tersedia':'QR Code not available yet',",
  "\n      'QR Code berhasil diunduh!':'QR Code downloaded successfully!',",
  "\n      'Apakah Anda yakin ingin menghapus semua riwayat?':'Are you sure you want to delete all history?',",
  "\n      'Riwayat berhasil dihapus!':'History deleted successfully!',",
  "\n      'Jatuh pada hari':'Falls on',",
  "\n      'Invalid Cron Expression':'Invalid Cron Expression',",
  "\n      '● Online':'● Online',",
  "\n      '● Offline':'● Offline',",
  "\n      'Tidak diketahui':'Unknown',",
  "\n      'Mengambil data...':'Fetching data...',",
  "\n      'ERR':'ERR',",
  "\n      'Error: Invalid URL format':'Error: Invalid URL format',",
  "\n      'Copied!':'Copied!',",
  "\n      'Hasil':'Result',",
  "\n      'Tools':'Tools',",
  "\n      'Generating...':'Generating...',",
  "\n      'Stop':'Stop',",
  "\n      'Start':'Start',",
  "\n      '✓ Valid':'✓ Valid',",
  "\n      '⚠ Terlalu pendek':'⚠ Too short',",
  "\n      'Contact':'Contact',",
];

const newContent = content.slice(0, insertPos) + newPhrases.join('') + content.slice(insertPos);
fs.writeFileSync(filePath, newContent);
console.log('Added ' + newPhrases.length + ' phrases');
