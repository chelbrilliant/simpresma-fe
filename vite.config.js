import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
        svgr({
            svgrOptions: {
                icon: true,
                exportType: 'named',
                namedExport: 'ReactComponent',
            },
        }),
    ],
});
