// main.js

document.addEventListener("DOMContentLoaded", function() {
    
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            
            // 1. Design anwenden (Hintergrund & Logo)
            applySettings(data.settings);

            // 2. Menüs bauen
            buildHeader(data.headerLinks);
            buildFooter(data.footerLinks);
        })
        .catch(error => console.error('Fehler beim Laden der config.json:', error));

});

/**
 * Wendet Hintergrundbild und Logos an
 */
function applySettings(settings) {
    if (!settings) return;

    // A) Hintergrundbild setzen
    if (settings.backgroundImage) {
        document.body.style.backgroundImage = `url('${settings.backgroundImage}')`;
    }

    // B) Logo auf der Startseite (index.html) aktualisieren
    // Wir suchen nach dem Bild mit der Klasse 'center-logo'
    const mainLogo = document.querySelector('.center-logo');
    if (mainLogo && settings.logoImage) {
        mainLogo.src = settings.logoImage;
    }
}

// ... Hier folgen deine Funktionen buildHeader und buildFooter wie vorher ...
function buildHeader(links) {
    const container = document.getElementById('header-placeholder');
    if (!container) return;
    let html = '<nav class="header-nav"><ul>';
    links.forEach(link => {
        html += `<li><a href="${link.url}" class="nav-link">${link.text}</a></li>`;
    });
    html += '</ul></nav>';
    container.innerHTML = html;
}

function buildFooter(links) {
    const container = document.getElementById('footer-placeholder');
    if (!container) return;
    let html = '<nav class="footer-nav">';
    links.forEach(link => {
        html += `<a href="${link.url}" class="nav-link">${link.text}</a>`;
    });
    html += '</nav>';
    container.innerHTML = html;
}
