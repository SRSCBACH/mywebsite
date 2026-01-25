// main.js - OHNE 3 Sekunden Verzögerung

document.addEventListener("DOMContentLoaded", function() {

    // 1. Header laden und sofort einfügen
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Fehler beim Laden des Headers:', error));

    // 2. Footer laden und sofort einfügen
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Fehler beim Laden des Footers:', error));

    // Der setTimeout Block wurde hier komplett entfernt.
});
