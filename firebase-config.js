// firebase-config.js — SITUS ADMIN (untuk repo Admin-web-jadwal)
// Isi dengan config Firebase yang SAMA PERSIS seperti di situs publik.
//
// Ganti nilai-nilai di bawah ini dengan config dari project Firebase kamu.
// Cara ambilnya: Firebase Console → project kamu → klik ikon gerigi (Project settings)
// → scroll ke "Your apps" → pilih app web → bagian "SDK setup and configuration".
//
// Config ini AMAN untuk ditaruh di kode publik (bukan rahasia) — yang menjaga
// keamanan data adalah "Firestore Security Rules", bukan menyembunyikan config ini.

export const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};
