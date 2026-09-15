// Isi ini sebelum menjalankan server.
export default {
  // Port server. Kalau di-deploy ke Railway/Render, mereka biasanya inject
  // PORT lewat environment variable secara otomatis — baris di bawah sudah
  // menangani itu, jadi biasanya tidak perlu diubah.
  port: process.env.PORT || 3000,

  // Domain website kamu (yang berisi worldmarket-panel.html / index.html).
  // Wajib diisi supaya proxy ini hanya bisa dipanggil dari website kamu,
  // bukan dari sembarang situs lain. Boleh isi lebih dari satu kalau perlu
  // (misalnya domain custom + subdomain hosting bawaan), pisahkan pakai koma.
  // Contoh: "https://tokosaya.com,https://tokosaya.vercel.app"
  // Isi "*" kalau mau izinkan semua origin (tidak disarankan untuk produksi).
  allowedOrigin: process.env.ALLOWED_ORIGIN || "*",
};
