// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar el ServiceWorker:', error);
            });
    });
}

// Menú responsive
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Instalación de la PWA
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

window.addEventListener('appinstalled', () => {
    console.log('PWA instalada');
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// Carga de videos (podrías usar una API aquí)
function loadVideos() {
    // En una app real, esto vendría de una API o base de datos
    const videos = {
        html: [
            {id: 'example2', title: 'Introducción a HTML', desc: 'Aprende los fundamentos de HTML5'},
            // más videos...
        ],
        css: [
            // videos de CSS
        ],
        js: [
            // videos de JavaScript
        ]
    };
    
    // Aquí iría el código para renderizar los videos en el DOM
}