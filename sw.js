/* ==========================================================
   Topper Study Hub
   Service Worker
   Version 1.0.0
========================================================== */

const CACHE_NAME = "topper-study-hub-v1.0.0";

/* ==========================================================
   Files to Cache
========================================================== */

const STATIC_ASSETS = [

    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./subjects.json",
    "./manifest.json",

    "./assets/logo.png",
    "./assets/banner.jpg",
    "./assets/favicon.ico",

    "./assets/icons/icon-72.png",
    "./assets/icons/icon-96.png",
    "./assets/icons/icon-128.png",
    "./assets/icons/icon-144.png",
    "./assets/icons/icon-152.png",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-384.png",
    "./assets/icons/icon-512.png"

];

/* ==========================================================
   Install
========================================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            console.log("Caching App Files...");

            return cache.addAll(STATIC_ASSETS);

        })

    );

    self.skipWaiting();

});

/* ==========================================================
   Activate
========================================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        console.log("Removing old cache:", key);

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ==========================================================
   Fetch
========================================================== */

self.addEventListener("fetch", event => {

    if(event.request.method !== "GET"){

        return;

    }

    event.respondWith(

        caches.match(event.request)

        .then(cacheResponse => {

            if(cacheResponse){

                return cacheResponse;

            }

            return fetch(event.request)

            .then(networkResponse => {

                if(

                    !networkResponse ||

                    networkResponse.status !== 200 ||

                    networkResponse.type !== "basic"

                ){

                    return networkResponse;

                }

                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME)

                .then(cache => {

                    cache.put(event.request, responseClone);

                });

                return networkResponse;

            })

            .catch(() => {

                if(event.request.destination === "document"){

                    return caches.match("./index.html");

                }

            });

        })

    );

});

/* ==========================================================
   Messages
========================================================== */

self.addEventListener("message", event => {

    if(event.data === "skipWaiting"){

        self.skipWaiting();

    }

});

/* ==========================================================
   Sync (Optional)
========================================================== */

self.addEventListener("sync", event => {

    if(event.tag === "sync-data"){

        console.log("Background Sync");

    }

});

/* ==========================================================
   Push Notifications (Optional)
========================================================== */

self.addEventListener("push", event => {

    if(!event.data) return;

    const data = event.data.json();

    self.registration.showNotification(

        data.title,

        {

            body:data.body,

            icon:"./assets/icons/icon-192.png",

            badge:"./assets/icons/icon-72.png"

        }

    );

});

/* ==========================================================
   Notification Click
========================================================== */

self.addEventListener("notificationclick", event => {

    event.notification.close();

    event.waitUntil(

        clients.openWindow("./index.html")

    );

});

/* ==========================================================
   End
========================================================== */
