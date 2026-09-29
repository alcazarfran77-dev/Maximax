/* Service Worker de Maximax — hace que la app funcione en modo avión (o sin
   señal en general) una vez que se abrió por lo menos una vez con internet.
   No tiene nada que ver con el intercambio de paquetes entre personas (eso
   ya funcionaba sin conexión desde el principio) — esto es específicamente
   para que la propia APP (el HTML, sus íconos, y las 4 librerías que usa
   para generar/leer QR) se pueda abrir sin descargar nada de internet.

   Estrategia:
   - El HTML principal se pide primero a la red (para tener siempre la
     versión más nueva si hay señal) y si no hay red, se sirve la copia
     guardada.
   - Todo lo demás (íconos, manifest, y las librerías externas) se sirve
     primero desde la copia guardada — son archivos que no cambian solos
     (las librerías están fijadas a una versión exacta en su URL), así que
     no hace falta volver a pedirlos cada vez. */

const CACHE_NAME = "maximax-cache-v1";

// Recursos propios del sitio (rutas relativas a donde vive este archivo).
const RECURSOS_PROPIOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png",
];

// Las 4 librerías externas que la app necesita para generar y leer QR.
const RECURSOS_EXTERNOS = [
  "https://cdnjs.cloudflare.com/ajax/libs/pako/2.2.0/pako.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.4.4/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js",
  "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js",
];

// Guarda un recurso en la caché intentando primero un fetch normal (CORS) y,
// si eso falla (por ejemplo, algún proxy raro que bloquee CORS), reintenta
// en modo "opaco" — sirve igual para volver a entregarlo después, aunque no
// se pueda inspeccionar su contenido. Cada recurso se maneja por separado
// para que si UNO falla, no se caiga el guardado de todos los demás.
async function guardarConReintento(cache, url) {
  try {
    const resp = await fetch(url, { mode: "cors" });
    if (resp.ok) { await cache.put(url, resp); return; }
    throw new Error("respuesta no OK: " + resp.status);
  } catch (e1) {
    try {
      const respOpaca = await fetch(url, { mode: "no-cors" });
      await cache.put(url, respOpaca);
    } catch (e2) {
      console.warn("[Maximax SW] no se pudo guardar en caché:", url, e2);
    }
  }
}

self.addEventListener("install", (evento) => {
  self.skipWaiting();
  evento.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        [...RECURSOS_PROPIOS, ...RECURSOS_EXTERNOS].map((url) => guardarConReintento(cache, url))
      );
    })()
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      // Borra cachés de versiones anteriores del Service Worker, si las hubiera.
      const nombres = await caches.keys();
      await Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  if (peticion.method !== "GET") return; // no interceptar POST/PUT/etc.

  const esHtmlPrincipal = peticion.mode === "navigate" || peticion.destination === "document";

  if (esHtmlPrincipal) {
    // Red primero (para tener la versión más nueva si hay señal); si falla, caché.
    evento.respondWith(
      (async () => {
        try {
          const respRed = await fetch(peticion);
          const cache = await caches.open(CACHE_NAME);
          cache.put(peticion, respRed.clone());
          return respRed;
        } catch (e) {
          const respCache = await caches.match(peticion);
          return respCache || caches.match("./index.html");
        }
      })()
    );
    return;
  }

  // Todo lo demás (íconos, manifest, librerías): caché primero, red como respaldo.
  evento.respondWith(
    (async () => {
      const respCache = await caches.match(peticion);
      if (respCache) return respCache;
      try {
        const respRed = await fetch(peticion);
        const cache = await caches.open(CACHE_NAME);
        cache.put(peticion, respRed.clone());
        return respRed;
      } catch (e) {
        return respCache; // undefined si tampoco estaba en caché — el navegador lo maneja como fallo de red normal
      }
    })()
  );
});
