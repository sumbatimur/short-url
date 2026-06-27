"use client";

// app/not-found.tsx
// ============================================================
// Halaman 404 — Link Tidak Ditemukan
// Fitur:
// - Bilingual ID/EN (auto deteksi browser + toggle manual)
// - Auth-aware: cek apakah user sudah login atau belum
// - Logo OneClick
// - Fun & playful design
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Konten Bilingual ─────────────────────────────────────────────────────────

const content = {
  id: {
    badge:       "Link tidak ditemukan",
    title:       "Aduh, link-nya kabur kemana?",
    subtitle:    "Link yang kamu akses tidak ada, sudah dihapus, atau mungkin sudah kadaluarsa. Coba periksa lagi ya!",
    tips: [
      "Cek ejaan URL",
      "Link mungkin expired",
      "Link dinonaktifkan",
    ],
    btnHome:     "Kembali ke Beranda",
    btnLogin:    "Masuk ke Akun",
    btnRegister: "Daftar Gratis",
    btnCreate:   "Buat Link Baru",
    loggedIn:    "Kamu sudah login",
    notLoggedIn: "Belum punya akun?",
  },
  en: {
    badge:       "Link not found",
    title:       "Oops, where did this link go?",
    subtitle:    "The link you're trying to access doesn't exist, has been deleted, or may have expired. Double-check the URL!",
    tips: [
      "Check the URL spelling",
      "Link may have expired",
      "Link was deactivated",
    ],
    btnHome:     "Back to Home",
    btnLogin:    "Sign In",
    btnRegister: "Sign Up Free",
    btnCreate:   "Create New Link",
    loggedIn:    "You're signed in",
    notLoggedIn: "Don't have an account?",
  },
};

type Lang = "id" | "en";

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotFound() {
  const [lang,     setLang]     = useState<Lang>("id");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [slug,     setSlug]     = useState("");

  // Auto-detect bahasa browser
  useEffect(() => {
    const browserLang = navigator.language?.toLowerCase() ?? "";
    setLang(browserLang.startsWith("id") ? "id" : "en");
  }, []);

  // Ambil slug dari URL untuk ditampilkan
  useEffect(() => {
    const path = window.location.pathname;
    setSlug(path.replace("/", "") || "unknown");
  }, []);

  // Cek status login via Supabase
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Dynamic import agar tidak error jika supabase belum tersedia
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const t = content[lang];

  // URL login & register SaaS utama kamu
  // Ganti dengan URL domain utama SaaS kamu
  const MAIN_APP_URL    = "https://oneclicksumba.web.id";
  const LOGIN_URL       = `${MAIN_APP_URL}/login`;
  const REGISTER_URL    = `${MAIN_APP_URL}/register`;
  const DASHBOARD_URL   = `${MAIN_APP_URL}/dashboard`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 text-center">

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full border border-border bg-background p-1">
        {(["id", "en"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all
              ${lang === l
                ? "bg-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Ilustrasi */}
      <div className="mb-6 animate-bounce" style={{ animationDuration: "3s" }}>
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-3xl bg-violet-100 flex items-center justify-center text-6xl shadow-sm">
            🔗
          </div>
          {/* Dekorasi */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-base animate-spin" style={{ animationDuration: "4s" }}>
            ?
          </div>
          <div className="absolute -bottom-2 -left-3 w-6 h-6 rounded-full bg-pink-200" />
          <div className="absolute top-2 -left-4 w-4 h-4 rounded-full bg-blue-200" />
          <div className="absolute -bottom-1 -right-4 w-5 h-5 rounded-full bg-green-200" />
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
        <span>😕</span>
        {t.badge}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-medium text-foreground mb-3 leading-tight">
        {t.title} 👀
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
        {t.subtitle}
      </p>

      {/* Slug yang dicoba diakses */}
      <div className="inline-flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-4 py-2.5 mb-8 font-mono text-sm">
        <span className="text-muted-foreground">short.oneclicksumba.web.id /</span>
        <span className="text-violet-600 font-medium">{slug}</span>
      </div>

      {/* CTA Buttons — berdasarkan status login */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {isLoggedIn === null ? (
          // Loading state
          <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        ) : isLoggedIn ? (
          // User sudah login → arahkan ke dashboard untuk buat link baru
          <>
            <a
              href={DASHBOARD_URL}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
            >
              ✨ {t.btnCreate}
            </a>
            <p className="text-xs text-muted-foreground">
              {t.loggedIn} ·{" "}
              <a href={DASHBOARD_URL} className="text-violet-600 hover:underline">
                Dashboard
              </a>
            </p>
          </>
        ) : (
          // User belum login → arahkan ke login atau register
          <>
            <a
              href={LOGIN_URL}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
            >
              🔑 {t.btnLogin}
            </a>
            <a
              href={REGISTER_URL}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              🚀 {t.btnRegister}
            </a>
            <p className="text-xs text-muted-foreground">
              {t.notLoggedIn}{" "}
              <a href={REGISTER_URL} className="text-violet-600 hover:underline">
                {t.btnRegister}
              </a>
            </p>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        {t.tips.map((tip, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-full px-3 py-1.5"
          >
            <span>{["✏️", "⏰", "🚫"][i]}</span>
            {tip}
          </span>
        ))}
      </div>

      {/* Logo OneClick */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {/* Ganti src dengan URL logo kamu */}
          <img
            src="/logo.png"
            alt="OneClick"
            className="h-6 w-auto"
            onError={(e) => {
              // Fallback ke teks jika logo tidak ada
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-xs text-muted-foreground">
            by <span className="text-violet-600 font-medium">OneClick</span>
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          URL Shortener · QR Code · Certificate
        </p>
      </div>

    </div>
  );
}