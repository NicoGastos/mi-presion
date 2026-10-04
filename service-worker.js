const CACHE_NAME = "mi-presion-v3.0";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png",
  "./manual.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((respuesta) => {
        const copia = respuesta.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copia);
        });

        return respuesta;
      })
      .catch(() => caches.match(event.request))
  );
});
