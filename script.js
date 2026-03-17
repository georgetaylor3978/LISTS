let currentData = {
    Movies: [],
    TV: [],
    Books: []
};

let activeTab = 'Movies';
let filteredData = [];

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');
const directorFilter = document.getElementById('directorFilter');
const sortBy = document.getElementById('sortBy');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const loadingSpinner = document.getElementById('loadingSpinner');
const noDataMessage = document.getElementById('noDataMessage');
const totalCountEl = document.getElementById('totalCount');
const avgRatingEl = document.getElementById('avgRating');

// Filter groups to toggle
const yearFilterGroup = document.getElementById('yearFilterGroup');
const directorFilterGroup = document.getElementById('directorFilterGroup');

// Initialize
function init() {
    try {
        currentData = typeof collectionData !== 'undefined' ? collectionData : { Movies: [], TV: [], Books: [] };
        
        // Setup Event Listeners
        setupListeners();
        
        // Initial render
        renderTab(activeTab);
    } catch (error) {
        console.error('Error loading data:', error);
        tableBody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#ef4444;">Error loading data</td></tr>';
    }
}

function setupListeners() {
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            activeTab = e.target.dataset.tab;
            
            // Reset filters on tab change
            searchInput.value = '';
            yearFilter.value = '';
            directorFilter.value = '';
            sortBy.value = 'none';
            
            renderTab(activeTab);
        });
    });

    searchInput.addEventListener('input', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    directorFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
}

function populateDropdowns(data, isMovie) {
    // Clear existing
    yearFilter.innerHTML = '<option value="">All Years</option>';
    directorFilter.innerHTML = '<option value="">All</option>';

    const years = new Set();
    const directors = new Set();

    data.forEach(item => {
        if (item.Year) years.add(item.Year);
        if (item.Director) directors.add(item.Director);
        if (item.Author) directors.add(item.Author); // For books if applicable
    });

    // Sort and append years
    Array.from(years).sort((a, b) => b - a).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Sort and append directors/authors
    Array.from(directors).sort().filter(d => d).forEach(director => {
        const option = document.createElement('option');
        option.value = director;
        option.textContent = director;
        directorFilter.appendChild(option);
    });

    // Toggle visibility based on tab
    yearFilterGroup.classList.remove('hide');
    
    if (isMovie) {
        directorFilterGroup.classList.remove('hide');
        directorFilterGroup.querySelector('label').textContent = 'Director';
    } else if (activeTab === 'Books') {
        directorFilterGroup.classList.remove('hide');
        directorFilterGroup.querySelector('label').textContent = 'Author';
    } else {
        directorFilterGroup.classList.add('hide');
    }
}

function renderTab(tabName) {
    const data = currentData[tabName] || [];
    filteredData = [...data];
    
    const isMovie = tabName === 'Movies';
    populateDropdowns(data, isMovie);
    
    renderTableHeaders(tabName);
    applyFilters(); // This will eventually call renderTableBody
}

function renderTableHeaders(tabName) {
    if (filteredData.length === 0) {
        tableHeader.innerHTML = '<th>No Data Available</th>';
        return;
    }
    
    // Dynamically generate column headers based on keys
    const firstItem = filteredData[0];
    const keys = Object.keys(firstItem).filter(key => key !== 'Seen'); // Hide Seen column if desired, or keep it
    
    tableHeader.innerHTML = keys.map(key => `<th>${key}</th>`).join('');
}

function applyFilters() {
    let result = [...(currentData[activeTab] || [])];
    const searchTerm = searchInput.value.toLowerCase();
    const yearVal = yearFilter.value;
    const dirVal = directorFilter.value;
    const sortVal = sortBy.value;

    // Filter
    result = result.filter(item => {
        // Search text across all values
        const matchesSearch = Object.values(item).some(val => 
            String(val || '').toLowerCase().includes(searchTerm)
        );

        const matchesYear = !yearVal || String(item.Year) === yearVal;
        
        const directorAuthorVal = item.Director || item.Author || '';
        const matchesDir = !dirVal || directorAuthorVal === dirVal;

        return matchesSearch && matchesYear && matchesDir;
    });

    // Sort
    if (sortVal !== 'none') {
        result.sort((a, b) => {
            if (sortVal === 'name_asc') {
                const nameA = a.Movie || a.Book || Object.values(a)[0] || '';
                const nameB = b.Movie || b.Book || Object.values(b)[0] || '';
                return String(nameA).localeCompare(String(nameB));
            }
            if (sortVal === 'name_desc') {
                const nameA = a.Movie || a.Book || Object.values(a)[0] || '';
                const nameB = b.Movie || b.Book || Object.values(b)[0] || '';
                return String(nameB).localeCompare(String(nameA));
            }
            if (sortVal === 'year_desc') {
                return (b.Year || 0) - (a.Year || 0);
            }
            if (sortVal === 'year_asc') {
                return (a.Year || 0) - (b.Year || 0);
            }
            if (sortVal === 'rating_desc') {
                return (b.Rating || 0) - (a.Rating || 0);
            }
            if (sortVal === 'rating_asc') {
                return (a.Rating || 0) - (b.Rating || 0);
            }
            return 0;
        });
    }

    filteredData = result;
    renderTableBody();
    updateStats();
}

function renderTableBody() {
    if (filteredData.length === 0) {
        tableBody.innerHTML = '';
        noDataMessage.classList.remove('hide');
        document.querySelector('.table-container').style.display = 'none';
        return;
    }

    noDataMessage.classList.add('hide');
    document.querySelector('.table-container').style.display = 'block';

    const keys = Object.keys(filteredData[0]).filter(key => key !== 'Seen');
    
    tableBody.innerHTML = filteredData.map(item => {
        const rowHTML = keys.map(key => {
            let val = item[key] || '-';
            
            // Special formatting for rating
            if (key === 'Rating' && val !== '-') {
                return `<td><span class="rating-badge"><i class="fa-solid fa-star" style="font-size:0.75rem;margin-right:4px;"></i>${val}</span></td>`;
            }
            
            return `<td>${val}</td>`;
        }).join('');
        
        return `<tr>${rowHTML}</tr>`;
    }).join('');
}

function updateStats() {
    totalCountEl.textContent = filteredData.length;
    
    // Calculate average rating
    const ratings = filteredData.filter(i => i.Rating).map(i => parseFloat(i.Rating) || 0);
    if (ratings.length > 0) {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        avgRatingEl.textContent = avg.toFixed(1);
    } else {
        avgRatingEl.textContent = '-';
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
