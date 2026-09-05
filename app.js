// Configuration Supabase
const SUPABASE_URL = 'https://iaxkqzhqvxwtcmftvriy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sHHoDyI1epMxyadImC69nA_b7qcyyiv';

// Initialiser Supabase (si la librairie est chargée)
let supabase = null;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Charger et afficher les données CSV
async function loadCSVData() {
    try {
        const response = await fetch('data.csv');
        const text = await response.text();
        const csvDisplay = document.getElementById('csv-data');
        
        // Simple CSV parsing
        const lines = text.trim().split('\n');
        let html = '<table style="width: 100%; border-collapse: collapse;">';
        
        lines.forEach((line, index) => {
            const cells = line.split(',');
            const tag = index === 0 ? 'th' : 'td';
            html += '<tr>';
            cells.forEach(cell => {
                html += `<${tag} style="border: 1px solid #ddd; padding: 8px;">${cell.trim()}</${tag}>`;
            });
            html += '</tr>';
        });
        
        html += '</table>';
        csvDisplay.innerHTML = html;
    } catch (error) {
        document.getElementById('csv-data').innerHTML = `<p>❌ Erreur: ${error.message}</p>`;
    }
}

// Tester la connexion Supabase
async function testSupabaseConnection() {
    const statusEl = document.getElementById('connection-status');
    const dataEl = document.getElementById('supabase-data');
    
    if (!supabase) {
        statusEl.textContent = '⚠️ Supabase SDK non chargé';
        dataEl.innerHTML = '<p>Ajouter la libraire Supabase pour activer cette section</p>';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('_realtime')
            .select('*')
            .limit(1);
        
        if (error) {
            statusEl.textContent = '✅ Connecté (pas de table "_realtime")';
            dataEl.innerHTML = '<p>Supabase est connecté mais aucune table n\'existe encore.</p>';
        } else {
            statusEl.textContent = '✅ Connecté à Supabase';
            dataEl.innerHTML = '<p>Prêt à stocker/récupérer des données !</p>';
        }
    } catch (error) {
        statusEl.textContent = '❌ Erreur de connexion';
        dataEl.innerHTML = `<p>Erreur: ${error.message}</p>`;
    }
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadCSVData();
    testSupabaseConnection();
});
