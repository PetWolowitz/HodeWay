import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      // Usa una versione compatibile con il browser per il modulo "crypto"
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    // Includi i pacchetti pdfmake per evitare problemi di compatibilità
    include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
  },
  server: {
    fs: {
      strict: false, // Consente l'accesso ai file esterni, se necessario
    },
  },
});
