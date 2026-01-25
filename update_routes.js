const fs = require('fs');
const path = require('path');
const gpxParser = require('gpx-parser');

// --- KONFIGURATION ---
// 1. Wo liegen deine GPX Dateien lokal auf dem PC?
const GPX_FOLDER = './gpxfiles'; 

// 2. Wo liegt deine JSON Datei?
const JSON_FILE = './strecken.json'; 

// 3. Basis-URL für den Download (GitHub Pages)
// Das Skript baut daraus: https://srscbach.github.io/mywebsite/gpxfiles/tour00.gpx
const BASE_URL = "https://srscbach.github.io/mywebsite/gpxfiles/";

// 4. Standardwerte für neue Touren
const DEFAULT_SPEED = 30; // Schnitt in km/h
const DEFAULT_PROFILE = "Wellig"; 

// ---------------------

function getGpxStats(filePath) {
    try {
        const builder = new gpxParser();
        const content = fs.readFileSync(filePath, 'utf8');
        builder.parse(content);

        const track = builder.tracks[0];
        if (!track) return null;

        // Distanz in km
        const distanceKm = track.distance.total / 1000;

        // Höhenmeter berechnen (positive Anstiege summieren)
        let elevationGain = 0;
        const points = track.points;
        for (let i = 1; i < points.length; i++) {
            const diff = points[i].ele - points[i-1].ele;
            if (diff > 0) {
                elevationGain += diff;
            }
        }

        return {
            distanz: Math.round(distanceKm),
            hoehenmeter: Math.round(elevationGain)
        };
    } catch (err) {
        console.error(`Fehler beim Lesen von ${filePath}:`, err.message);
        return null;
    }
}

function calculateDuration(dist, speed) {
    const decimalHours = dist / speed;
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    if (hours > 0) {
        return `${hours} h ${minutes > 0 ? minutes + ' min' : ''}`;
    } else {
        return `${minutes} min`;
    }
}

// --- HAUPTPROGRAMM ---
try {
    // Ordner prüfen
    if (!fs.existsSync(GPX_FOLDER)) {
        console.error(`Fehler: Der Ordner '${GPX_FOLDER}' existiert nicht! Bitte erstellen.`);
        process.exit(1);
    }

    // 1. Bestehende JSON laden (falls vorhanden)
    let strecken = [];
    if (fs.existsSync(JSON_FILE)) {
        strecken = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    }

    // 2. GPX Ordner scannen
    const files = fs.readdirSync(GPX_FOLDER).filter(file => file.toLowerCase().endsWith('.gpx'));

    console.log(`Gefunden: ${files.length} GPX Dateien in '${GPX_FOLDER}'.`);

    files.forEach(file => {
        // ID aus Dateinamen extrahieren (sucht nach Zahlen, z.B. "05" in "tour05.gpx")
        const idMatch = file.match(/([0-9]+)/);
        if (!idMatch) return;
        
        const id = idMatch[0]; 
        const fullPath = path.join(GPX_FOLDER, file);

        // Daten berechnen
        const stats = getGpxStats(fullPath);
        
        if (stats) {
            const duration = calculateDuration(stats.distanz, DEFAULT_SPEED);
            
            // Link zusammenbauen: Basis-URL + Dateiname
            const onlineLink = BASE_URL + file;

            // Suche Eintrag in JSON
            let entry = strecken.find(s => s.id === id);

            if (entry) {
                console.log(`Update Tour ${id}: ${stats.distanz}km / ${stats.hoehenmeter}hm`);
                // Werte aktualisieren
                entry.distanz = stats.distanz.toString();
                entry.hoehenmeter = stats.hoehenmeter.toString();
                entry.dauer = duration;
                
                // Falls noch kein Link da ist oder er falsch ist -> aktualisieren
                if(!entry.gpx || entry.gpx.indexOf('gpxfiles') === -1) {
                    entry.gpx = onlineLink;
                }

                // Standardwerte setzen falls leer
                if(!entry.schnitt) entry.schnitt = `${DEFAULT_SPEED} km/h`;
                if(!entry.profil) entry.profil = DEFAULT_PROFILE;

            } else {
                console.log(`Neu erstellt: Tour ${id}`);
                // Neuen Eintrag erstellen
                strecken.push({
                    id: id,
                    active: true,
                    gpx: onlineLink,
                    komoot: "",
                    garmin: "",
                    schnitt: `${DEFAULT_SPEED} km/h`,
                    profil: DEFAULT_PROFILE,
                    distanz: stats.distanz.toString(),
                    hoehenmeter: stats.hoehenmeter.toString(),
                    dauer: duration
                });
            }
        }
    });

    // 3. Sortieren nach ID (00, 01, 02...)
    strecken.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    // 4. JSON Datei schreiben
    fs.writeFileSync(JSON_FILE, JSON.stringify(strecken, null, 4), 'utf8');
    console.log("--------------------------------------------------");
    console.log("ERFOLG: strecken.json wurde aktualisiert!");
    console.log("--------------------------------------------------");

} catch (e) {
    console.error("Ein unerwarteter Fehler ist aufgetreten:", e);
}
