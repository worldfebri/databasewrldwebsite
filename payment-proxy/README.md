# WorldMarket Payment Proxy

Server kecil yang menjembatani website (browser) dan **FR3 NEWERA**, supaya
panggilan payment gateway tidak diblokir CORS oleh browser. Server ini tidak
menyimpan API key — key tetap diisi admin di website seperti biasa, cuma
diteruskan lewat sini.

## Kenapa perlu ini

Browser tidak diizinkan memanggil `fr3newera.com` secara langsung (diblokir
CORS). Server ini yang memanggil FR3 NEWERA atas nama browser:

```
Browser (website)  →  Proxy server ini  →  fr3newera.com
```

## Cara deploy (pilih salah satu, gratis untuk skala kecil)

### Railway / Render (paling gampang)
1. Push folder `payment-proxy/` ini ke repo GitHub baru (atau tambahkan ke
   repo website kamu, di folder terpisah).
2. Di Railway/Render, buat **New Web Service**, hubungkan ke repo tadi, set
   **Root Directory** ke `payment-proxy` (kalau digabung satu repo dengan
   website).
3. Build command: `npm install`. Start command: `npm start`.
4. Isi environment variable `ALLOWED_ORIGIN` dengan domain website kamu,
   contoh: `https://tokosaya.com`. Boleh lebih dari satu, pisahkan koma.
5. Deploy. Kamu akan dapat URL publik, misalnya
   `https://worldmarket-payment-proxy.up.railway.app`.

### VPS / server sendiri
```bash
cd payment-proxy
npm install
ALLOWED_ORIGIN="https://tokosaya.com" PORT=3000 npm start
```
Jalankan di background pakai `pm2` atau `systemd` supaya tetap hidup, lalu
arahkan domain/subdomain ke server ini (nginx reverse proxy, dsb).

## Setelah deploy

1. Salin URL publik proxy kamu (contoh: `https://xxxx.up.railway.app`).
2. Di website, buka **Pengaturan → Payment Gateway**, isi field
   **"Proxy Server URL"** dengan URL itu.
3. Klik "Tes koneksi & cek saldo" — kalau berhasil, saldo FR3 NEWERA akan
   muncul.

## Catatan

- Server ini perlu **tetap hidup terus-menerus** (sama seperti bot Telegram
  verifikasi), bukan cuma dijalankan sekali.
- `ALLOWED_ORIGIN` sebaiknya diisi domain website kamu yang sebenarnya, agar
  proxy ini tidak bisa dipakai sembarang situs lain. Default `*` (semua
  origin) hanya untuk kemudahan testing.
