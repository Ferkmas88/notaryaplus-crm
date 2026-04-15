# NotaryaPlus CRM

CRM minimalista + tracking de fuentes para el bot de WhatsApp de **3-1 Notary A Plus**.

## Qué hace

- **5 enlaces de tracking** — uno para cada fuente (web, Facebook, Google, Instagram, Clientes360)
- **Redirectores con click logging** — cada click se registra en el bot antes de abrir WhatsApp
- **Dashboard privado** — clicks, leads, conversiones por fuente + lista de últimos leads
- **Password único compartido** — Fernan y Myrna usan la misma contraseña

## Cómo funciona

```
Cliente en Facebook
       ↓
https://notaryaplus-crm.vercel.app/r/facebook   ← click logged
       ↓
wa.me/15027555027?text=Hola, vengo desde su página de Facebook
       ↓
Bot recibe mensaje → detecta "facebook" en el texto → guarda lead con source=facebook
       ↓
Dashboard muestra lead bajo Facebook ✅
```

## Enlaces de tracking generados

| Fuente | URL |
|---|---|
| Sitio Web | `/r/web` |
| Facebook | `/r/facebook` |
| Google | `/r/google` |
| Instagram | `/r/instagram` |
| Clientes 360 | `/r/clientes360` |

## Deploy a Vercel

1. Subir a GitHub:
   ```bash
   cd notaryaplus-crm
   git init && git add . && git commit -m "initial"
   gh repo create notaryaplus-crm --public --source=. --push
   ```
2. En Vercel → Import → seleccionar repo
3. Configurar env vars:
   ```
   BOT_API_URL=https://web-production-c32f8.up.railway.app
   WA_PHONE=15027555027
   DASHBOARD_PASSWORD=<elige_una>
   COOKIE_SECRET=<32 chars random>
   ```
4. Deploy → URL queda como `https://notaryaplus-crm.vercel.app`

## Modificaciones al bot (ya aplicadas)

El bot `whatsapp-bot/bot.py` tiene:
- `/api/click` POST — recibe clicks de los redirectores
- `/clicks` GET — devuelve todos los clicks
- **Detección de fuente** — lee el primer mensaje de cada nuevo lead y tag con `source`

## Password recomendado

**Sí, usar el mismo password para Fernan y Myrna.** Razones:
- Es la misma organización, no hay roles distintos
- Un password reduce fricción (no se olvida nadie)
- Si Myrna lo necesita, Fernan lo comparte por SMS/WhatsApp
- Si alguien se va, se cambia y listo (1 minuto)

Si en el futuro quieres separar roles (Myrna solo ve leads, Fernan todo), agregamos NextAuth con multi-usuario.

## Desarrollo local

```bash
cp .env.example .env.local
# editar .env.local con tus valores
npm install
npm run dev
```

Abrir http://localhost:3000
