# Maximax — lista para GitHub Pages

Esta carpeta contiene únicamente lo que hace falta para publicar la app:

- `index.html` — la app completa (un solo archivo, sin dependencias locales; las
  librerías que usa se cargan desde CDN por internet).
- `sw.js` — el Service Worker que guarda la app y sus librerías la primera vez
  que se abre con internet, para que después funcione igual **en modo avión o
  sin señal** — ver la sección de abajo.
- `manifest.json` — le dice al navegador cómo se llama la app, de qué color es y
  qué ícono usar al agregarla a la pantalla de inicio (Android/Chrome).
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`
  — el ícono de Maximax en los tamaños que pide cada sistema. `apple-touch-icon.png`
  es aparte porque iOS/Safari no lee el `manifest.json` para esto — necesita su
  propia etiqueta.
- `.nojekyll` — le dice a GitHub Pages que sirva los archivos tal cual, sin pasarlos
  por su procesador Jekyll (no hace falta para que funcione, pero evita sorpresas).

No hace falta ningún paso de build ni instalar nada — es HTML puro.

## Modo avión / sin señal

La app ya podía **intercambiar** paquetes (generar y leer QR) sin conexión desde
el principio — eso nunca dependió de internet. Lo que agrega `sw.js` es que la
**app en sí** (el HTML y las 4 librerías que usa) también se pueda abrir sin
conexión, una vez que ya se abrió por lo menos una vez con internet.

Cómo funciona en la práctica:
1. La primera vez que alguien entra a la app (con señal), el celular guarda una
   copia de todo lo necesario.
2. De ahí en adelante, aunque se ponga el celular en modo avión o no haya señal,
   la app abre igual — sea desde el navegador o ya instalada en la pantalla de
   inicio.
3. Si en algún momento hay señal otra vez, la app se actualiza sola a la última
   versión publicada, sin que haga falta hacer nada.

Esto se probó de punta a punta simulando una conexión real cortada (no solo
revisando el código): se cargó la app con conexión, se cortó la red por
completo, se recargó la página, y se generó un QR nuevo completo — sin ningún
error y sin necesitar internet en ningún momento de esa segunda parte.

## Publicarla en GitHub Pages

### 1. Crear el repositorio

En [github.com](https://github.com), botón **New** → elegí un nombre (por ejemplo
`maximax-app`) → **Create repository**. Puede ser público o privado — GitHub Pages
funciona con los dos (en un repo privado, Pages requiere una cuenta con plan
GitHub Pro/Team/Enterprise; en uno público es gratis siempre).

### 2. Subir los archivos de esta carpeta

**Opción A — desde el navegador (sin usar la terminal):**
Entrá al repositorio → **Add file** → **Upload files** → arrastrá todos los
archivos de esta carpeta (`index.html`, `sw.js`, `manifest.json`, los 4 íconos
`.png`, y `.nojekyll`) → **Commit changes**.

> Si no ves el archivo `.nojekyll` en tu explorador de archivos es porque empieza
> con un punto y tu sistema operativo lo esconde por default — activá "mostrar
> archivos ocultos" para encontrarlo, o simplemente saltealo: no es obligatorio.

**Opción B — desde la terminal (git):**
```bash
cd maximax-github-pages
git init
git add .
git commit -m "Primera versión de Maximax"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

### 3. Activar GitHub Pages

En el repositorio: **Settings** → **Pages** (en el menú de la izquierda) →
en **Source** elegí **Deploy from a branch** → en **Branch** elegí **main** y la
carpeta **/ (root)** → **Save**.

### 4. Esperar y entrar

GitHub tarda uno o dos minutos en publicarla la primera vez. Cuando está lista,
la misma página de **Settings → Pages** muestra un aviso verde con la URL:

```
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

Entrá ahí desde el celular o la computadora — ya es la app funcionando en vivo,
sin instalar nada.

## Actualizar la app más adelante

Cuando tengas una versión nueva de `index.html`, solo hace falta reemplazar el
archivo:

- **Por el navegador:** entrá al archivo `index.html` dentro del repositorio →
  ícono de lápiz (editar) → pegá el contenido nuevo, o borralo y volvé a usar
  **Add file → Upload files** con el archivo actualizado → **Commit changes**.
- **Por terminal:** reemplazá el archivo local y corré
  `git add . && git commit -m "Actualización" && git push`.

GitHub Pages vuelve a publicar sola, en general en menos de un minuto.

## Cosas para tener en cuenta

- **Necesita internet para cargar**, aunque después funcione sin conexión: la
  primera vez que se abre, el celular descarga las pocas librerías que la app usa
  (generar y leer QR). Una vez cargada, generar y escanear códigos no depende de
  tener señal — solo la sincronización en segundo plano si la usás.
- **La cámara para escanear QR solo funciona por HTTPS** (o en `localhost`) — por
  eso abrir el `index.html` como archivo local a veces no deja usar la cámara,
  pero publicado en GitHub Pages (que siempre es HTTPS) sí funciona normalmente.
- **El ícono al agregar la app a la pantalla de inicio** se ve una vez que la app
  está publicada por HTTPS — no se ve igual si solo abrís el `index.html` como
  archivo local. En Android/Chrome, el navegador puede ofrecer directamente
  "Instalar app" o "Agregar a pantalla de inicio"; en iPhone/Safari es
  **Compartir → Agregar a pantalla de inicio**.
- **El modo avión también necesita HTTPS** (los Service Worker, igual que la
  cámara, no funcionan abriendo el archivo local) — funciona automáticamente
  una vez publicado en GitHub Pages, sin ningún paso extra.
- Cada dispositivo guarda su propia identidad, inventario e historial en el
  propio navegador (`localStorage`) — no es un dato compartido entre quienes
  entran a la misma URL, cada quien tiene el suyo en su celular.
