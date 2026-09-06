# Jadwal Kuliah — dengan Firebase (gratis)

Sekarang situs publik dan situs admin **nyambung langsung lewat database
gratis (Firebase Firestore)** — tidak ada lagi proses download/upload
`jadwal.json` manual. Begitu admin simpan perubahan, situs publik otomatis
ikut ter-update (real-time, tanpa perlu refresh).

```
jadwal-publik/   -> situs yang dilihat mahasiswa
jadwal-admin/    -> situs khusus admin untuk mengisi/mengubah jadwal
```

Login admin sekarang juga pakai **Firebase Authentication** (email +
password sungguhan), bukan password yang ditulis di kode seperti sebelumnya
— jauh lebih aman.

---

## Ringkasan alur baru

1. Admin isi/ubah/hapus jadwal di situs admin.
2. Data langsung tersimpan ke Firestore (database gratis dari Google).
3. Situs publik otomatis menampilkan perubahan itu — **tidak perlu upload apa-apa ke GitHub lagi** setelah setup awal selesai.

Setup awal (bikin project Firebase, isi config, buat akun admin) cukup
dilakukan **satu kali**. Setelah itu, update jadwal sehari-hari tinggal
login ke situs admin dan edit seperti biasa.

---

## Langkah 1 — Buat project Firebase (gratis, ±5 menit)

1. Buka https://console.firebase.google.com, login pakai akun Google.
2. Klik **Add project** (Tambahkan project). Kasih nama bebas, misal `jadwal-kuliah`.
3. Untuk Google Analytics, boleh dimatikan saja (tidak perlu untuk proyek ini) → klik **Create project**.
4. Setelah project jadi, di halaman utama project klik ikon **`</>`** (Web) untuk mendaftarkan situs web baru.
5. Kasih nickname bebas (misal "jadwal-web"), **jangan** centang "Firebase Hosting" (tidak perlu, karena sudah pakai GitHub Pages). Klik **Register app**.
6. Firebase akan menampilkan kode `firebaseConfig` seperti ini:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "jadwal-kuliah-xxxxx.firebaseapp.com",
     projectId: "jadwal-kuliah-xxxxx",
     storageBucket: "jadwal-kuliah-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
   **Salin nilai-nilai ini** — akan dipakai di langkah 3.

## Langkah 2 — Aktifkan Firestore Database & Authentication

**Firestore (tempat data jadwal disimpan):**
1. Di menu kiri Firebase Console, klik **Build → Firestore Database**.
2. Klik **Create database**.
3. Pilih **Start in production mode** → pilih lokasi server (bebas, misal `asia-southeast2 (Jakarta)`) → **Enable**.
4. Setelah database aktif, klik tab **Rules**, hapus isinya, ganti dengan ini, lalu **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /jadwal/{docId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   Artinya: **siapa saja boleh membaca** jadwal (situs publik), tapi **hanya yang sudah login** yang boleh mengubah data (situs admin).

**Authentication (buat akun login admin):**
1. Menu kiri → **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → klik **Email/Password** → aktifkan (Enable) → **Save**.
3. Tab **Users** → klik **Add user** → isi email & password untuk admin (misal `admin@kampusmu.ac.id` + password sendiri) → **Add user**.
4. Email & password ini yang dipakai untuk login di situs admin nanti.

## Langkah 3 — Isi config di kode

Di **kedua** folder (`jadwal-publik/` dan `jadwal-admin/`) ada file `firebase-config.js`. Isi keduanya dengan config yang kamu salin di Langkah 1 (isinya harus **sama persis** di kedua file):

```js
export const firebaseConfig = {
  apiKey: "...isi punya kamu...",
  authDomain: "...isi punya kamu...",
  projectId: "...isi punya kamu...",
  storageBucket: "...isi punya kamu...",
  messagingSenderId: "...isi punya kamu...",
  appId: "...isi punya kamu..."
};
```

> Config ini aman ditaruh di kode publik (bukan rahasia seperti password) — yang menjaga keamanan data adalah **Firestore Rules** di Langkah 2, bukan menyembunyikan config ini.

## Langkah 4 — Upload ke GitHub seperti biasa

- Upload isi folder `jadwal-publik/` ke repo situs publik (`Web-jadwal-v2`), replace file yang lama.
- Upload isi folder `jadwal-admin/` ke repo situs admin (`Admin-web-jadwal`), replace file yang lama.
- Tunggu GitHub Pages build ulang (1-2 menit).

## Langkah 5 — Migrasi data lama (sekali saja)

Kamu sudah punya 24 jadwal di `jadwal.json` lama — supaya tidak perlu ketik ulang manual:

1. Buka situs admin yang baru, login dengan email & password dari Langkah 2.
2. Klik jurusan/kelas apa saja (langkahnya cuma untuk masuk ke panel — data akan otomatis masuk ke jurusan/kelas yang benar sesuai isi file, tidak tercampur).

   Sebenarnya tombol migrasi ada di halaman atas (sebelum pilih jurusan), jadi bisa langsung dipakai begitu login:
3. Klik **"Migrasi dari jadwal.json (sekali saja)"**, pilih file `jadwal.json` yang ada di folder `jadwal-admin/` (isinya 24 jadwal kamu yang lama).
4. Tunggu sampai muncul "Selesai — 24 jadwal dimigrasi."
5. Cek situs publik — semua jadwal lama harusnya sudah muncul lagi, sekarang datanya ada di Firestore.

⚠️ Jalankan migrasi ini **hanya sekali**. Kalau diklik dua kali dengan file yang sama, jadwalnya akan dobel (karena migrasi menambahkan, bukan mengganti). Kalau kepencet dua kali, tinggal hapus manual data yang dobel lewat panel admin.

---

## Kalau lupa password admin

Buka **Firebase Console → Authentication → Users**, cari email admin, klik menu titik tiga di baris itu → **Reset password** (akan dikirim email reset), atau hapus user lalu buat lagi dengan password baru.

## Menambah admin lain

Tinggal tambah user baru di **Firebase Console → Authentication → Users → Add user**. Semua admin memakai situs admin yang sama, tidak perlu situs terpisah per orang.

## Batas gratis Firebase (Spark plan)

Untuk skala jadwal kuliah kampus (puluhan-ratusan baris data, dibuka ribuan kali per hari oleh mahasiswa), jauh di bawah batas gratis Firebase:
- Firestore: 50.000 pembacaan data & 20.000 penulisan per hari — gratis selamanya, tanpa kartu kredit.

## Menjalankan / mengetes secara lokal

```bash
cd jadwal-publik && python3 -m http.server 8000    # buka http://localhost:8000
cd jadwal-admin  && python3 -m http.server 8001    # buka http://localhost:8001
```
(Pastikan `firebase-config.js` sudah diisi terlebih dulu supaya data benar-benar termuat.)
