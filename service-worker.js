const CACHE_NAME = "gymtrack-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",

    "./allenamenti.html",
    "./allenamenti.css",
    "./allenamenti.js",

    "./allenamento.html",
    "./allenamento.css",
    "./allenamento.js",

    "./manifest.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// INSTALLAZIONE

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();

});


// ATTIVAZIONE

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


// RICHIESTE

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request);

            })

    );

});