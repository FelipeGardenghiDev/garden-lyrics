# Diretrizes do Projeto — Garden Lyrics

> Este documento serve como guia técnico e arquitetural para o desenvolvimento contínuo do **Garden Lyrics** em qualquer estação de trabalho.

---

## 1. Visão & Princípios Fundamentais

1. **Privacidade de Obras Inéditas:** Composições e letras não gravadas são ativos de altíssimo valor intelectual. O Garden Lyrics armazena letras e gravações de voz exclusivamente no `localStorage` e `IndexedDB` do cliente, sem nenhum envio para servidores externos.
2. **Escansão Rítmica & Métrica:** Compor uma letra de música difere de escrever um texto convencional: o número de sílabas cantadas (e a junção de vogais entre palavras vizinhas, a chamada *sinalefa*) determina se a frase vai encaixar na métrica rítmica do compasso.
3. **Fluidez Criativa:** O letrista não pode ser interrompido por popups, logins ou telas de carregamento. O app abre instantaneamente em branco ou na última música editada.

---

## 2. Estrutura de Pastas e Módulos

```text
src/
├── core/
│   └── lyric-engine.ts         # Contagem de sílabas poéticas e dicionário fonético de rimas
├── types/
│   └── index.ts                # Modelos de Seções, Versos, Metadados e Voice Memos
├── components/
│   └── VoiceMemoRecorder.tsx   # Gravador de áudio local via MediaRecorder API
├── App.tsx                     # Gestão das seções, busca de rimas e exportação
└── index.css                   # Tailwind v4 e estilos tipográficos
```

---

## 3. Próximos Passos Recomendados no Roadmap

1. **Dicionário Fonético Ampliado:**
   - Adicionar suporte a rimas em inglês e espanhol, além do português.
2. **Dicionário de Sinônimos e Campos Semânticos:**
   - Sugestões de metáforas e palavras associadas por tema emocional (ex: "noite", "desespero", "mar", "saudade").
3. **Sincronização com o `garden-teleprompt`:**
   - Um botão para exportar a letra diretamente no formato com acordes e setlist para o app de palco.
