# SIMPRESMA — TailAdmin React + Laravel

Project ini mengimplementasikan frontend SIMPRESMA di atas TailAdmin dengan React, TypeScript, Tailwind CSS, Vite, dan Laravel 12 sebagai shell project.

## Stack
- Laravel 12
- React 19
- Tailwind CSS 4
- Vite 6
- React Router 7
- TypeScript 5.7

## Run
```bash
composer install
copy .env.example .env
php artisan key:generate
npm install
npm run dev
```

Pada terminal lain:
```bash
php artisan serve
```

Buka `http://127.0.0.1:8000` lalu gunakan `/mock-access` untuk simulasi SSO pada tahap frontend.

## Role SRS
- Mahasiswa
- Verifikator
- Tendik
- Wadek (Superadmin)
- Kaprodi

## Status Integrasi

Frontend menggunakan data dummy/localStorage untuk mensimulasikan alur pengajuan, verifikasi, konversi, pemilihan mata kuliah, master data, manajemen akses, pemantauan Wadek/Kaprodi, upload SK, dan laporan Excel. Integrasi SSO, API Master Mata Kuliah, database, Object Storage, dan Webhook Telegram belum dihubungkan.
