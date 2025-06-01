// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
                
                // Verificar si hay una nueva versión del Service Worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Mostrar notificación de actualización
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('Error al registrar el ServiceWorker:', error);
            });
    });
}

// Función para mostrar notificación de actualización
function showUpdateNotification() {
    if (confirm('Hay una nueva versión disponible. ¿Quieres recargar para actualizar?')) {
        window.location.reload();
    }
}

// Menú responsive
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Instalación de la PWA
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
    
    // Mostrar automáticamente el prompt de instalación después de 5 segundos
    setTimeout(() => {
        if (deferredPrompt) {
            showInstallPrompt();
        }
    }, 5000);
});

installBtn.addEventListener('click', () => {
    showInstallPrompt();
});

function showInstallPrompt() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
            } else {
                console.log('Usuario rechazó la instalación');
            }
            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }
}

window.addEventListener('appinstalled', () => {
    console.log('PWA instalada');
    installBtn.style.display = 'none';
    deferredPrompt = null;
    
    // Registrar evento de instalación en analytics
    if ('ga' in window) {
        ga('send', 'event', 'PWA', 'install');
    }
});

// Detectar conexión
function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    document.documentElement.setAttribute('data-status', status);
    
    if (!navigator.onLine) {
        showOfflineMessage();
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

function showOfflineMessage() {
    const offlineMessage = document.createElement('div');
    offlineMessage.className = 'offline-message';
    offlineMessage.textContent = 'Estás sin conexión. Algunas funciones pueden no estar disponibles.';
    document.body.prepend(offlineMessage);
    
    setTimeout(() => {
        offlineMessage.remove();
    }, 5000);
}

// Carga de videos dinámica
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.video-grid')) {
        loadVideos();
    }
});

async function loadVideos() {
    try {
        // En una app real, esto vendría de una API
        const response = await fetch('videos.json');
        const videos = await response.json();
        
        renderVideos(videos);
    } catch (error) {
        console.error('Error al cargar videos:', error);
        // Intentar cargar desde caché
        const cachedResponse = await caches.match('videos.json');
        if (cachedResponse) {
            const videos = await cachedResponse.json();
            renderVideos(videos);
        }
    }
}

function renderVideos(videos) {
    const currentPage = window.location.pathname.split('/').pop();
    let category = 'html';
    
    if (currentPage === 'css.html') category = 'css';
    if (currentPage === 'js.html') category = 'js';
    
    const videoGrid = document.querySelector('.video-grid');
    
    if (videos[category]) {
        videoGrid.innerHTML = videos[category].map(video => `
            <div class="video-card">
                <h3>${video.title}</h3>
                <div class="video-wrapper">
                    <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p>${video.desc}</p>
            </div>
        `).join('');
    }
}