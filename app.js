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
const resultsText = document.getElementById('results-text');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const lastUpdate = document.getElementById('last-update');
const totalCount = document.getElementById('total-count');

// Charger les données
async function loadData() {
    try {
        const response = await fetch('base%20de%20connaissance.csv');
        const csv = await response.text();
        
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        allData = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;
            
            const parts = line.split(',');
            const row = {};
            headers.forEach((header, index) => {
                const key = header.toLowerCase().replace(/\s+/g, '_').replace(/é/g, 'e');
                row[key] = parts[index] ? parts[index].trim() : '';
            });
            
            if (Object.values(row).some(v => v)) {
                allData.push(row);
            }
        }
        
        filteredData = [...allData];
        lastUpdate.textContent = new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        createTagFilters();
        displayData();

    } catch (error) {
        dataContainer.innerHTML = `<div class="no-results"><p>❌ Erreur: ${error.message}</p></div>`;
    }
}

// Créer filtres
function createTagFilters() {
    const tags = new Set();
    allData.forEach(item => {
        const etKey = item.etiquettes || item.étiquettes || '';
        if (etKey) {
            etKey.split(',').map(e => e.trim()).filter(e => e).forEach(tag => tags.add(tag));
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

// Filtrer données
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredData = allData.filter(item => {
        const matchSearch = !searchTerm || 
            Object.values(item).some(val => 
                val && val.toString().toLowerCase().includes(searchTerm)
            );

        if (!matchSearch) return false;
        
        if (activeTags.size === 0) return true;
        
        const etKey = item.etiquettes || item.étiquettes || '';
        const itemTags = etKey.split(',').map(e => e.trim()).filter(e => e);
        return itemTags.some(tag => activeTags.has(tag));
    });

    displayData();
}

// Afficher données
function displayData() {
    dataContainer.innerHTML = '';
    const count = filteredData.length;
    resultsCount.textContent = count;
    resultsText.textContent = count === allData.length 
        ? `Affichage de ${count} ressources`
        : `${count} ressource${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`;

    if (count === 0) {
        dataContainer.innerHTML = '<div class="no-results"><p>😞 Aucune ressource trouvée</p><p>Essayez d\'autres critères</p></div>';
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let html = '<div class="card-header">';
        if (item.nom) {
            html += `<div class="card-title">${escapeHtml(item.nom)}</div>`;
        }
        const dateKey = item.date_de_mise_a_jour_n8n || item.date_mise_a_jour_n8n || '';
        if (dateKey) {
            html += `<div class="card-subtitle">📅 ${escapeHtml(dateKey)}</div>`;
        }
        html += '</div>';

        html += '<div class="card-body">';
        
        if (item.texte) {
            html += '<div class="card-field">';
            html += '<span class="card-label">Description</span>';
            html += `<div class="card-text-box card-content">${escapeHtml(item.texte)}</div>`;
            html += '</div>';
        }
        
        if (item.url) {
            html += '<div class="card-field">';
            html += '<span class="card-label">Ressource</span>';
            html += `<a href="${escapeHtml(item.url)}" target="_blank" class="card-link">Ouvrir le lien →</a>`;
            html += '</div>';
        }
        
        const noteKey = item.note_alex || item.note_Alex || '';
        if (noteKey) {
            html += '<div class="card-field">';
            html += '<span class="card-label">Notes</span>';
            html += `<div class="card-content">${escapeHtml(noteKey)}</div>`;
            html += '</div>';
        }
        
        html += '</div>';

        html += '<div class="card-footer">';
        const etKey = item.etiquettes || item.étiquettes || '';
        if (etKey) {
            html += '<div class="card-tags">';
            etKey.split(',').map(t => t.trim()).filter(t => t).forEach(tag => {
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
    dataContainer.className = 'resources-grid grid-view';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    dataContainer.className = 'resources-grid list-view';
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
