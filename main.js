document.addEventListener("DOMContentLoaded", function() {
    
    // Wir laden die zentrale Konfigurationsdatei
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            // 1. Header bauen
            buildHeader(data.headerLinks);

            // 2. Footer bauen
            buildFooter(data.footerLinks);
        })
        .catch(error => console.error('Fehler beim Laden der config.json:', error));

});

/**
 * Baut das obere Menü (Struktur: nav > ul > li > a)
 */
function buildHeader(links) {
    const container = document.getElementById('header-placeholder');
    if (!container) return;

    // Das HTML-Gerüst erstellen
    let html = '<nav class="header-nav"><ul>';

    // Durch alle Links aus der JSON loopen
    links.forEach(link => {
        html += `<li><a href="${link.url}" class="nav-link">${link.text}</a></li>`;
    });

    html += '</ul></nav>';
    
    // Ins HTML einfügen
    container.innerHTML = html;
}

/**
 * Baut das untere Menü (Struktur: nav > a)
 * Footer hat im CSS kein <ul>, daher etwas anders aufgebaut
 */
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
