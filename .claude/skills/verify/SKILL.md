---
name: verify
description: Como buildar, rodar e dirigir o app Chabar end-to-end para verificar mudanças
---

# Verificar Chabar end-to-end

## Build + run
```bash
npm run build --prefix frontend        # backend serve frontend/dist
DATA_DIR=$(mktemp -d) PORT=3196 node backend/server.js
```
- `DATA_DIR` isolado = seed limpo (48 itens), não suja `backend/data/`.
- Env úteis: `RSVP_DEADLINE` (ISO; `2020-01-01` simula prazo expirado), `ADMIN_PASSWORD`.

## Dirigir (Playwright + Chrome do sistema)
`playwright` não é dependência do repo — instalar em dir temporário e usar
`chromium.launch({ channel: 'chrome', headless: true })` (usa `/usr/bin/google-chrome`, sem download).

Fluxos principais:
1. RSVP: preencher `input.field-input` (nome + sobrenome!) → `button.btn-primary` → texto "Presença confirmada!" → lista carrega sozinha (~2.3s).
2. Lista: `.gifts-grid`, cards `.gift-card`, busca `.search-input`, pills `.cat-pill`, reservar = botão dentro do card → toast.
3. Prazo expirado: visitante novo vê "Confirmações encerradas"; POST `/api/rsvp` → 403.
4. Convidado já confirmado: `addInitScript` setando `localStorage.chabar_rsvp = {"name":"...","confirmedAt":"..."}` → vai direto pra lista.

## Gotchas
- `.hero`/`.form-section` têm animação `fadeUp` 0.6-0.75s com opacity — esperar ~1s antes de screenshot (Playwright `isVisible` ignora opacity e passa antes da animação terminar).
- RSVP exige nome E sobrenome; só nome → erro de validação.
- 409 (nome duplicado) é tratado como sucesso pelo frontend.
- Matar servidor de teste: cuidado com `pkill -f server.js` — casa com `tsserver.js` do VS Code; usar PID.
