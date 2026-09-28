# Maximax — lista para GitHub Pages

Esta carpeta contiene únicamente lo que hace falta para publicar la app:

- `index.html` — la app completa (un solo archivo, sin dependencias locales; las
  librerías que usa se cargan desde CDN por internet).
- `.nojekyll` — le dice a GitHub Pages que sirva los archivos tal cual, sin pasarlos
  por su procesador Jekyll (no hace falta para que funcione, pero evita sorpresas).

No hace falta ningún paso de build ni instalar nada — es HTML puro.

## Publicarla en GitHub Pages

### 1. Crear el repositorio

En [github.com](https://github.com), botón **New** → elegí un nombre (por ejemplo
`maximax-app`) → **Create repository**. Puede ser público o privado — GitHub Pages
funciona con los dos (en un repo privado, Pages requiere una cuenta con plan
GitHub Pro/Team/Enterprise; en uno público es gratis siempre).

### 2. Subir los archivos de esta carpeta

**Opción A — desde el navegador (sin usar la terminal):**
Entrá al repositorio → **Add file** → **Upload files** → arrastrá `index.html` y
`.nojekyll` (los dos archivos de esta carpeta) → **Commit changes**.

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
- Cada dispositivo guarda su propia identidad, inventario e historial en el
  propio navegador (`localStorage`) — no es un dato compartido entre quienes
  entran a la misma URL, cada quien tiene el suyo en su celular.
