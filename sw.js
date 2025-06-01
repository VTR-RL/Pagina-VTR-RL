const CACHE_NAME = 'codelearn-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/html.html',
    '/css.html',
    '/js.html',
    '/about.html',
    '/styles.css',
    '/app.js',
    '/icon-192x192.png',
    '/icon-512x512.png',
    'https://www.youtube.com/embed/mNbnV3aN3KA',
    '/css.html',
    '/js.html',
    'https://www.youtube.com/embed/OWKXEJN67FE',
    'https://www.youtube.com/embed/8QKOaTYvYUA',
    'https://www.youtube.com/embed/rg7Fvvl3taU',
    'https://www.youtube.com/embed/0sRZIkPyW3A',
    'https://www.youtube.com/embed/PkZNo7MFNFg',
    'https://www.youtube.com/embed/7WkfzokHGqo',
    'https://www.youtube.com/embed/0ik6X4DJKCc',
    'https://www.youtube.com/embed/6O8Xk43h7_4'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Estrategia Cache First con fallback a network
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve la respuesta en caché si existe
                if (response) {
                    return response;
                }
                
                // Clona la solicitud porque es un stream y solo se puede usar una vez
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    response => {
                        // Verifica si recibimos una respuesta válida
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clona la respuesta porque es un stream y solo se puede usar una vez
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                ).catch(() => {
                    // Si falla la red y no hay caché, puedes devolver una página de fallback
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});