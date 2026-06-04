# Guia de despliegue en Hostinger y Google AdSense

Esta guia deja UtilesOnline lista para publicarse como una aplicacion Next.js con App Router, API Routes y espacios de anuncios seguros.

## 1. Que tipo de hosting usar

UtilesOnline no debe subirse como HTML estatico normal porque usa Next.js con rutas dinamicas y API Routes.

Usa una de estas opciones:

- Hostinger Business Web Hosting con Node.js Web Apps.
- Hostinger Cloud con Node.js Web Apps.
- Hostinger VPS si quieres administrarlo manualmente.

Hostinger indica que sus Node.js Web Apps soportan Next.js y versiones Node 18, 20, 22 y 24. Este proyecto usa Node 20.

## 2. Preparacion local antes de subir

Ejecuta:

```bash
npm install
npm run lint
npm run build
```

Si todo pasa, la app esta lista para produccion.

Tambien puedes usar:

```bash
npm run predeploy
```

## 3. Variables de entorno

Crea las variables en Hostinger desde la configuracion de la app Node.js.

Usa como base el archivo:

```txt
.env.production.example
```

Variables importantes:

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-0000000000000000
NEXT_PUBLIC_ADSENSE_SLOT_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_CONTENT=
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=
NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT=
NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT=
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
```

Notas:

- `GROQ_API_KEY` nunca debe llevar `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SITE_URL` debe ser el dominio real con `https`.
- Deja `NEXT_PUBLIC_ADSENSE_ENABLED=false` hasta que AdSense apruebe el sitio.

## 4. Despliegue en Hostinger con GitHub

1. Sube el proyecto a GitHub.
2. En hPanel, entra a Websites.
3. Elige Node.js Web App.
4. Importa el repositorio desde GitHub.
5. Selecciona framework Next.js si Hostinger lo detecta.
6. Usa Node 20.
7. Build command:

```bash
npm install && npm run build
```

8. Start command:

```bash
npm run start
```

9. Agrega las variables de entorno.
10. Despliega.

Si Hostinger pide output directory, usa:

```txt
.next
```

## 5. Verificaciones despues de publicar

Abre estas URLs:

```txt
https://tudominio.com/
https://tudominio.com/sitemap.xml
https://tudominio.com/robots.txt
https://tudominio.com/manifest.webmanifest
https://tudominio.com/generador-qr
https://tudominio.com/contador-palabras
```

Comprueba:

- La home carga sin errores.
- Las herramientas abren.
- Las API routes funcionan para PDF, imagenes o IA si tienen variables.
- `sitemap.xml` muestra URLs con tu dominio real.
- `robots.txt` apunta al sitemap correcto.
- El certificado SSL esta activo.

## 6. Google Search Console

1. Entra a Google Search Console.
2. Agrega tu dominio.
3. Verifica la propiedad por DNS o meta tag.
4. Si usas meta tag, copia solo el codigo de verificacion en:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

5. Vuelve a desplegar.
6. Envia:

```txt
https://tudominio.com/sitemap.xml
```

## 7. Como solicitar Google AdSense

1. Publica la web con dominio real y SSL.
2. Asegurate de tener paginas legales:
   - Politica de privacidad.
   - Terminos de uso.
   - Politica de cookies.
   - Contacto.
   - Sobre nosotros.
3. Entra a AdSense.
4. Agrega el sitio.
5. Copia tu publisher ID, por ejemplo:

```txt
ca-pub-1234567890123456
```

6. Ponlo en:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
```

7. Para revision puedes dejar:

```env
NEXT_PUBLIC_ADSENSE_ENABLED=true
```

El proyecto ya agrega el script de AdSense en todas las paginas cuando esa variable esta activa.

## 8. Crear bloques de anuncios

Cuando AdSense apruebe el sitio:

1. Entra a Ads > By ad unit.
2. Crea bloques display responsive.
3. Copia cada `data-ad-slot`.
4. Completa:

```env
NEXT_PUBLIC_ADSENSE_SLOT_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_CONTENT=
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=
NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT=
NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT=
```

5. Activa:

```env
NEXT_PUBLIC_ADSENSE_ENABLED=true
```

6. Redeploy o restart de la app.

## 9. ads.txt

Cuando AdSense te entregue tu publisher ID, crea:

```txt
public/ads.txt
```

Con este contenido, cambiando el ID:

```txt
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

Luego verifica:

```txt
https://tudominio.com/ads.txt
```

No agregues un `ads.txt` falso antes de tener tu publisher ID real.

## 10. Politicas importantes de AdSense

Mantener:

- Anuncios separados de botones de descarga, conversion o copiar.
- Etiqueta clara: Publicidad.
- Nada de textos como "haz clic aqui", "apoya el sitio" o similares.
- Nada de flechas, animaciones o elementos que llamen atencion artificial al anuncio.
- No hacer clic en tus propios anuncios.
- No colocar anuncios dentro de menus, formularios o tarjetas de resultado.

El proyecto ya usa espacios separados:

- Banner superior.
- Bloque dentro del contenido.
- Sidebar en escritorio.
- Footer.
- Rieles laterales en escritorio.

## 11. Checklist final

Antes de pedir revision en AdSense:

- Dominio real conectado.
- SSL activo.
- Home sin contenido de prueba.
- Herramientas principales funcionando.
- Politicas legales publicadas.
- Contacto visible.
- Sitemap enviado a Search Console.
- Sin errores 500.
- Sin anuncios pegados a botones.
- `NEXT_PUBLIC_SITE_URL` apunta al dominio real.
- AdSense client correcto.

## Fuentes oficiales consultadas

- Hostinger Node.js Web Apps: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger Node.js support: https://support.hostinger.com/en/articles/1583661-is-node-js-supported-at-hostinger
- Google AdSense code: https://support.google.com/adsense/answer/9274634
- Connect your site to AdSense: https://support.google.com/adsense/answer/7584263
- AdSense ad placement policies: https://support.google.com/adsense/answer/1346295
- AdSense Program policies: https://support.google.com/adsense/answer/48182
- ads.txt guide: https://support.google.com/adsense/answer/12171612
