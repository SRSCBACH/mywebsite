document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Die zentrale Konfigurationsdatei laden
    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Konnte config.json nicht laden.");
            }
            return response.json();
        })
        .then(data => {
            
            // A) Globale Einstellungen anwenden (Hintergrund & Logo)
            if (data.settings) {
                applySettings(data.settings);
            }

            // B) Header Menü bauen
            if (data.headerLinks) {
                buildHeader(data.headerLinks);
            }

            // C) Footer Menü bauen
            if (data.footerLinks) {
                buildFooter(data.footerLinks);
            }

        })
        .catch(error => console.error('Fehler in main.js:', error));

});

/**
 * Wendet Hintergrundbild und Logo an
 */
function applySettings(settings) {
    // Hintergrundbild für den Body setzen
    if (settings.backgroundImage) {
        document.body.style.backgroundImage = `url('${settings.backgroundImage}')`;
    }

    // Logo austauschen (nur wenn ein Element mit Klasse .center-logo existiert, z.B. auf Startseite)
    const mainLogo = document.querySelector('.center-logo');
    if (mainLogo && settings.logoImage) {
        mainLogo.src = settings.logoImage;
    }
}

/**
 * Baut das obere Menü in den Placeholder ein
 */
function buildHeader(links) {
    const container = document.getElementById('header-placeholder');
    if (!container) return; // Abbrechen, falls Placeholder auf der Seite fehlt

    // HTML-Struktur für den Header (nav > ul > li > a)
    let html = '<nav class="header-nav"><ul>';

    links.forEach(link => {
        html += `<li><a href="${link.url}" class="nav-link">${link.text}</a></li>`;
    });

    html += '</ul></nav>';
    
    container.innerHTML = html;
}

/**
 * Baut das untere Menü in den Placeholder ein
 */
function buildFooter(links) {
    const container = document.getElementById('footer-placeholder');
    if (!container) return; // Abbrechen, falls Placeholder fehlt

    // HTML-Struktur für den Footer (nav > a)
    let html = '<nav class="footer-nav">';

    links.forEach(link => {
        html += `<a href="${link.url}" class="nav-link">${link.text}</a>`;
    });

    html += '</nav>';

    container.innerHTML = html;
}
