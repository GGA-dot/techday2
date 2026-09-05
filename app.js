// Configuration Supabase
const SUPABASE_URL = 'https://iaxkqzhqvxwtcmftvriy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sHHoDyI1epMxyadImC69nA_b7qcyyiv';

// Initialiser Supabase
const supabase = supabase_js.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Charger les données depuis Supabase
async function loadData() {
    try {
        // Mettre à jour le statut
        connectionStatus.style.background = 'rgba(255, 193, 7, 0.2)';
        statusIcon.textContent = '⏳';
        statusText.textContent = 'Chargement...';

        // Récupérer les données
        const { data, error } = await supabase
            .from('base_connaissance')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        allData = data || [];
        filteredData = [...allData];

        // Mettre à jour le statut
        connectionStatus.style.background = 'rgba(74, 222, 128, 0.2)';
        statusIcon.textContent = '✅';
        statusText.textContent = `${allData.length} entrées`;

        // Créer les filtres de tags
        createTagFilters();

        // Afficher les données
        displayData();

    } catch (error) {
        console.error('Erreur Supabase:', error);
        connectionStatus.style.background = 'rgba(239, 68, 68, 0.2)';
        statusIcon.textContent = '❌';
        statusText.textContent = 'Erreur de connexion';
        dataContainer.innerHTML = `<div class="no-results"><p>❌ Erreur: ${error.message}</p></div>`;
    }
}

// Créer les filtres de tags
function createTagFilters() {
    const tags = new Set();
    allData.forEach(item => {
        if (item.etiquettes) {
            const etiquettes = item.etiquettes.split(',').map(e => e.trim()).filter(e => e);
            etiquettes.forEach(tag => tags.add(tag));
        }
    });

    tagsContainer.innerHTML = '';
    
    // Ajouter un bouton "Tous"
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

    // Ajouter les tags
    tags.forEach(tag => {
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
        // Filtre par recherche
        const matchSearch = !searchTerm || 
            (item.nom && item.nom.toLowerCase().includes(searchTerm)) ||
            (item.texte && item.texte.toLowerCase().includes(searchTerm)) ||
            (item.url && item.url.toLowerCase().includes(searchTerm)) ||
            (item.etiquettes && item.etiquettes.toLowerCase().includes(searchTerm));

        if (!matchSearch) return false;

        // Filtre par tags
        if (activeTags.size === 0) return true;
        
        if (!item.etiquettes) return false;
        const itemTags = item.etiquettes.split(',').map(e => e.trim());
        return itemTags.some(tag => activeTags.has(tag));
    });

    displayData();
}

// Afficher les données
function displayData() {
    dataContainer.innerHTML = '';
    resultsCount.textContent = `${filteredData.length} résultat(s)`;

    if (filteredData.length === 0) {
        dataContainer.innerHTML = '<div class="no-results"><p>😞 Aucun résultat trouvé</p></div>';
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let html = '';
        
        // Titre
        if (item.nom) {
            html += `<div class="card-title">${escapeHtml(item.nom)}</div>`;
        }

        // Contenu
        html += '<div class="card-content">';
        
        if (item.texte) {
            html += `<p class="card-text">${escapeHtml(item.texte)}</p>`;
        }
        
        if (item.url) {
            html += `<a href="${escapeHtml(item.url)}" target="_blank" class="card-url">🔗 Lien</a>`;
        }
        
        html += '</div>';

        // Méta
        html += '<div class="card-meta">';
        
        if (item.etiquettes) {
            const tags = item.etiquettes.split(',').map(t => t.trim()).filter(t => t);
            tags.forEach(tag => {
                html += `<span class="card-tag">${escapeHtml(tag)}</span>`;
            });
        }
        
        if (item.note_alex) {
            html += `<span class="card-note">⭐ ${escapeHtml(item.note_alex)}</span>`;
        }
        
        html += '</div>';

        card.innerHTML = html;
        dataContainer.appendChild(card);
    });
}

// Échapper le HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    filterData();
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterData();
});

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', loadData);
