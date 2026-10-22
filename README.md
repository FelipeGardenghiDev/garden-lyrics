# ✍️ Garden Lyrics

> **Songwriter Studio, Poetic Meter, Syllables & Rhymes.**
> Estúdio de escrita para letristas e compositores: contagem em tempo real de sílabas poéticas por verso (escansão rítmica com elisão), dicionário de rimas integrado, estruturador de seções de música e gravador de memos vocais para vincular melodias cantaroladas às estrofes.

Parte da **Garden Suite** — ferramentas de código aberto de nível Senior/Staff, 100% gratuitas, offline-first e pensadas para o fluxo criativo sem distrações.

---

## ✨ Recursos

- 📏 **Contador de Sílabas Poéticas em Tempo Real**: Mostra o número de sílabas de cada verso enquanto você digita, ajudando a garantir que a letra caiba no compasso e na divisão da melodia.
- 🎯 **Dicionário de Rimas, Sinônimos Poéticos & Metáforas**: Dê duplo clique em qualquer palavra para receber sugestões de rimas ou explore o dicionário poético temático (Amor, Tristeza, Esperança, Tempo, Solidão, Liberdade) com metáforas evocativas.
- 📑 **Estruturador de Música**: Organize suas ideias em blocos de `[Intro]`, `[Verso]`, `[Pré-Refrão]`, `[Refrão]`, `[Ponte]`, `[Solo]` e `[Outro]`.
- 🎙️ **Gravador de Memos Vocais**: Grave pequenos áudios da melodia cantada para não esquecer o ritmo do refrão e mantenha-os salvos na mesma tela da letra.
- 📜 **Exportador Direto para Garden Teleprompt**: Formata e copia instantaneamente a letra com tags de seção estruturadas para carregar no teleprompter de palco em 1 clique.
- 🖨️ **Exportação & Cópia Rápida**: Copie a letra completa em texto formatado ou imprima em PDF.
- 🌐 **Deploy no GitHub Pages**: Executável diretamente pelo navegador em qualquer dispositivo: [https://felipegardenghidev.github.io/garden-lyrics/](https://felipegardenghidev.github.io/garden-lyrics/)
- 📱 **Compilação Contínua de APK Android**: A cada commit na branch `main`, o GitHub Actions compila o APK nativo (`garden-lyrics-debug-apk`) disponível para download imediato na aba **Actions**.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS v4 + Lucide Icons
- **Poetic Core**: Algoritmo de escansão silábica com elisão e motor fonético de rimas
- **Audio Recorder**: Web MediaRecorder API
- **Mobile Engine**: Capacitor 8 (Android)
- **Testes & CI**: Vitest + GitHub Actions

---

## 🚀 Como Executar

### 1. Requisitos
- Node.js 20+
- npm 10+

### 2. Instalação e Desenvolvimento Web
```bash
git clone https://github.com/FelipeGardenghiDev/garden-lyrics.git
cd garden-lyrics
npm install
npm run dev
```

### 3. Testes Unitários
```bash
npm test
```

### 4. Build para Produção
```bash
npm run build
```

### 5. Executar no Android (APK / Emulador)
```bash
npm run mobile:sync
npm run mobile:open # Abre o projeto no Android Studio
```

---

## 📜 Licença

MIT License © 2026 Felipe Gardenghi. Feito para poetas, compositores e músicos independentes.
