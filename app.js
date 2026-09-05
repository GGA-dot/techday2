// État de l'app
let allData = [];
let filteredData = [];
let activeTags = new Set();

// Éléments DOM
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const tagsContainer = document.getElementById('tags-container');
const dataContainer = document.getElementById('data-container');
const resultsCount = document.getElementById('results-count');
const connectionStatus = document.getElementById('connection-status');
const statusIcon = document.getElementById('status-icon');
const statusText = document.getElementById('status-text');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const lastUpdate = document.getElementById('last-update');

// Charger les données depuis le CSV
async function loadData() {
    try {
        connectionStatus.style.background = 'rgba(255, 193, 7, 0.2)';
        statusIcon.textContent = '⏳';
        statusText.textContent = 'Chargement...';

        // Charger base de connaissance.csv
        const response = await fetch('base%20de%20connaissance.csv');
        const csv = await response.text();
        
        // Parser le CSV
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        allData = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;
            
            // Simple split pour le CSV
            const parts = line.split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.toLowerCase().replace(/\s+/g, '_').replace(/é/g, 'e')] = parts[index] ? parts[index].trim() : '';
            });
            
            if (Object.values(row).some(v => v)) {
                allData.push(row);
            }
        }
        
        filteredData = [...allData];

        connectionStatus.style.background = 'rgba(74, 222, 128, 0.2)';
        statusIcon.textContent = '✅';
        statusText.textContent = `${allData.length} ressources chargées`;
        lastUpdate.textContent = `Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}`;

        createTagFilters();
        displayData();

    } catch (error) {
        console.error('Erreur:', error);
        connectionStatus.style.background = 'rgba(239, 68, 68, 0.2)';
        statusIcon.textContent = '❌';
        statusText.textContent = 'Erreur de chargement';
        dataContainer.innerHTML = `<div class="no-results"><p>❌ ${error.message}</p></div>`;
    }
}

// Créer les filtres de tags
function createTagFilters() {
    const tags = new Set();
    allData.forEach(item => {
        const etiquettes_key = item.etiquettes || item.étiquettes || '';
        if (etiquettes_key) {
            const etiquettes = etiquettes_key.split(',').map(e => e.trim()).filter(e => e);
            etiquettes.forEach(tag => tags.add(tag));
        }
    });

    tagsContainer.innerHTML = '';
    
    const allBtn = document.createElement('button');
    allBtn.textContent = '🔄 Tous';
    allBtn.className = 'tag active';
    allBtn.onclick = () => {
        activeTags.clear();
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        allBtn.classList.add('active');
        filterData();
    };
    tagsContainer.appendChild(allBtn);

    Array.from(tags).sort().forEach(tag => {
        const btn = document.createElement('button');
        btn.textContent = tag;
        btn.className = 'tag';
        btn.onclick = () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                activeTags.add(tag);
            } else {
                activeTags.delete(tag);
            }
            filterData();
        };
        tagsContainer.appendChild(btn);
    });
}

// Filtrer les données
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredData = allData.filter(item => {
        const matchSearch = !searchTerm || 
            Object.values(item).some(val => 
                val && val.toString().toLowerCase().includes(searchTerm)
            );

        if (!matchSearch) return false;
        
        if (activeTags.size === 0) return true;
        
        const etiquettes_key = item.etiquettes || item.étiquettes || '';
        const itemTags = etiquettes_key.split(',').map(e => e.trim()).filter(e => e);
        return itemTags.some(tag => activeTags.has(tag));
    });

    displayData();
}

// Afficher les données
function displayData() {
    dataContainer.innerHTML = '';
    resultsCount.textContent = `📊 ${filteredData.length} résultat(s) sur ${allData.length}`;

    if (filteredData.length === 0) {
        dataContainer.innerHTML = '<div class="no-results"><p>😞 Aucun résultat trouvé</p></div>';
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let html = '';
        
        html += '<div class="card-header">';
        if (item.nom) {
            html += `<div class="card-title">${escapeHtml(item.nom)}</div>`;
        }
        const dateField = item.date_de_mise_a_jour_n8n || item.date_mise_a_jour_n8n || '';
        if (dateField) {
            html += `<div class="card-subtitle">📅 ${escapeHtml(dateField)}</div>`;
        }
        html += '</div>';

        html += '<div class="card-body">';
        
        if (item.texte) {
            html += '<div class="card-field">';
            html += '<div class="card-field-label">📝 Description</div>';
            html += `<div class="card-text-content card-field-value">${escapeHtml(item.texte)}</div>`;
            html += '</div>';
        }
        
        if (item.url) {
            html += '<div class="card-field">';
            html += '<div class="card-field-label">🔗 Lien</div>';
            html += `<div class="card-url-wrapper"><a href="${escapeHtml(item.url)}" target="_blank" class="card-url">Ouvrir la ressource →</a></div>`;
            html += '</div>';
        }
        
        const noteField = item.note_alex || item.note_Alex || '';
        if (noteField) {
            html += '<div class="card-field">';
            html += '<div class="card-field-label">📋 Notes</div>';
            html += `<div class="card-field-value">${escapeHtml(noteField)}</div>`;
            html += '</div>';
        }
        
        html += '</div>';

        html += '<div class="card-footer">';
        const etiquettes_key = item.etiquettes || item.étiquettes || '';
        if (etiquettes_key) {
            const tags = etiquettes_key.split(',').map(t => t.trim()).filter(t => t);
            html += '<div class="card-tags">';
            tags.forEach(tag => {
                html += `<span class="card-tag">${escapeHtml(tag)}</span>`;
            });
            html += '</div>';
        }
        html += '</div>';

        card.innerHTML = html;
        dataContainer.appendChild(card);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

gridViewBtn.addEventListener('click', () => {
    dataContainer.className = 'data-container grid-view';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    dataContainer.className = 'data-container list-view';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    filterData();
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterData();
});

document.addEventListener('DOMContentLoaded', loadData);
