# UtilesOnline

Web de herramientas online creada con Next.js App Router, React, TypeScript y Tailwind CSS.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

Para validar antes de subir:

```bash
npm run predeploy
```

## Produccion

Usa Node.js 20 o superior.

Variables base:

```bash
cp .env.production.example .env.local
```

Configura:

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-0000000000000000
GROQ_API_KEY=
```

## Rutas principales

- `/`: inicio.
- `/[slug]`: herramienta individual.
- `/categorias/[category]`: categoria.
- `/blog`: articulos.
- `/guias`: guias.
- `/sitemap.xml`: sitemap.
- `/robots.txt`: robots.

## Hostinger y AdSense

La guia completa esta en:

```txt
docs/GUIA_HOSTINGER_ADSENSE.md
```

Resumen:

- Desplegar como Node.js Web App, no como HTML estatico.
- Build command: `npm install && npm run build`.
- Start command: `npm run start`.
- Mantener `NEXT_PUBLIC_ADSENSE_ENABLED=false` hasta tener el sitio revisado o los IDs correctos.
- Crear `public/ads.txt` solo cuando tengas tu publisher ID real.
