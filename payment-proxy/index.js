// Proxy kecil antara website (browser) dan FR3 NEWERA.
//
// Kenapa ini perlu: browser TIDAK BOLEH (dan tidak akan diizinkan oleh
// browser itu sendiri, lewat proteksi bernama CORS) memanggil API payment
// gateway pihak ketiga secara langsung. Server ini yang memanggil FR3
// NEWERA atas nama browser, lalu meneruskan hasilnya balik ke browser.
//
// Server ini TIDAK menyimpan API key FR3 — key tetap dikirim dari website
// (persis seperti sebelumnya, admin isi di Pengaturan → Payment Gateway),
// server ini cuma jadi "jembatan" supaya request tidak kena blokir CORS.

import express from "express";
import cors from "cors";
import config from "./config.js";

const FR3_BASE = "https://fr3newera.com/api/v1";
const app = express();
app.use(express.json());

const allowedOrigins =
  config.allowedOrigin === "*" ? "*" : config.allowedOrigin.split(",").map((s) => s.trim());
app.use(cors({ origin: allowedOrigins }));

async function forwardJson(res, url, options) {
  try {
    const upstream = await fetch(url, options);
    const data = await upstream.json().catch(() => ({}));
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ status: 502, error: "Proxy tidak bisa menghubungi FR3 NEWERA: " + e.message });
  }
}

app.get("/", (_req, res) => res.json({ ok: true, service: "worldmarket-payment-proxy" }));

app.post("/api/v1/topup", (req, res) =>
  forwardJson(res, `${FR3_BASE}/topup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  })
);

app.post("/api/v1/topup/cancel", (req, res) =>
  forwardJson(res, `${FR3_BASE}/topup/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  })
);

app.get("/api/v1/check-status", (req, res) => {
  const qs = new URLSearchParams(req.query).toString();
  forwardJson(res, `${FR3_BASE}/check-status?${qs}`, {});
});

app.get("/api/v1/check-saldo", (req, res) => {
  const qs = new URLSearchParams(req.query).toString();
  forwardJson(res, `${FR3_BASE}/check-saldo?${qs}`, {});
});

app.listen(config.port, () => {
  console.log(`Payment proxy jalan di port ${config.port}`);
});
