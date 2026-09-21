# SIMPRESMA — React + TailAdmin + Laravel

Project SIMPRESMA berbasis React + TypeScript + Tailwind CSS dengan layout TailAdmin dan Laravel sebagai shell project.

## Menjalankan

1. `composer install`
2. Salin `.env.example` menjadi `.env`
3. `php artisan key:generate`
4. `npm install`
5. `npm run dev`
6. Pada terminal lain jalankan `php artisan serve`
7. Buka `http://127.0.0.1:8000`
8. Untuk pengujian frontend tanpa SSO, buka `/mock-access`.

## Catatan Frontend Mock

- Integrasi SSO, API Master Mata Kuliah, database, Object Storage, dan Webhook Telegram belum dihubungkan karena project ini difokuskan pada frontend.
- `/mock-access` adalah simulasi akses/SSO untuk pengujian.
- Switch Role hanya dipertahankan sebagai kemudahan pengujian untuk akun dengan jabatan ganda; Wadek tidak menggunakan Switch Role.
- Wadek merupakan Superadmin dan dapat memberikan/mencabut role Verifikator, Tendik, dan Kaprodi.
- Wadek mengelola Master Data Bidang serta pemetaan Mata Kuliah ke Bidang.
- Verifikator mengelola Master Data SKS dan Nilai.
- Tendik hanya melihat detail konversi secara read-only dan mengunggah SK final.
- Kaprodi hanya melihat data, rekap, konversi, performa Verifikator, dan laporan pada Program Studinya sendiri.
- Data pengajuan, role, master data, dan hasil upload SK menggunakan localStorage untuk simulasi frontend.

## Lima Role SRS

1. Mahasiswa
2. Verifikator
3. Tendik
4. Wadek (Superadmin)
5. Kaprodi

## Pembagian Master Data

- **Bidang + Pemetaan Mata Kuliah:** dikelola Wadek.
- **SKS + Nilai:** dikelola Verifikator; Wadek dan Kaprodi hanya read-only.

Nilai/rentang master matrix pada frontend mengikuti contoh matriks pada SRS dan tetap dapat disesuaikan ketika aturan resmi/backend tersedia.
