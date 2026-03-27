// Backend URL for movie CRUD.
const API_URL = '/api/movies';

// Main grid where cards are rendered.
const movieGrid = document.getElementById('movieGrid');
// Empty-state box shown when there is no movie data.
const emptyState = document.getElementById('emptyState');
// Add/Edit modal wrapper.
const movieModal = document.getElementById('movieModal');
// Delete confirmation modal wrapper.
const deleteModal = document.getElementById('deleteModal');
// Form element inside add/edit modal.
const movieForm = document.getElementById('movieForm');
// Modal title text node.
const modalTitle = document.getElementById('modalTitle');
// Hidden field that stores current edit id.
const editId = document.getElementById('editId');

// Inputs
const titleInput = document.getElementById('title');
const genreInput = document.getElementById('genre');
const yearInput = document.getElementById('year');
const ratingInput = document.getElementById('rating');
const descriptionInput = document.getElementById('description');

// Hidden delete id
const deleteId = document.getElementById('deleteId');

// ====================== FETCH ======================
// FETCH all movies
async function fetchMovies() {
    const response = await fetch(API_URL);
    const movies = await response.json();
    renderMovies(movies);
}

// ====================== CREATE ======================
async function createMovie(data) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    fetchMovies();
    closeModal();
}

// ====================== UPDATE ======================
async function updateMovie(id, data) {
    await fetch(API_URL + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    fetchMovies();
    closeModal();
}

// ====================== DELETE ======================
async function deleteMovie(id) {
    await fetch(API_URL + '/' + id, { method: 'DELETE' });
    fetchMovies();
    closeDeleteModal();
}

// ====================== RENDER ======================
function renderMovies(movies) {
    if (!movies || movies.length === 0) {
        movieGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        movieGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        movieGrid.innerHTML = movies.map(createMovieCard).join('');
    }
}

// CREATE card UI
function createMovieCard(movie) {
    return `
    <div class="cpu-card">
        <div class="card-header">
            <div class="card-icon">
                <i class="bx bxs-movie"></i>
            </div>
            <div class="card-info">
                <div class="card-brand">${movie.title}</div>
                <div class="card-model">${movie.genre}</div>
            </div>
        </div>
        <div class="card-meta">
            <div class="card-price">⭐ ${movie.rating || 0}/10</div>
            <div class="card-size"><i class="bx bx-calendar"></i> ${movie.year}</div>
        </div>
        <div class="card-desc">${movie.description || ''}</div>
        <div class="card-actions">
            <button class="btn btn-ghost" onclick="openEditModal(${movie.id})">
                <i class="bx bx-pencil"></i> Edit
            </button>
            <button class="btn btn-ghost btn-delete" onclick="openDeleteModal(${movie.id})">
                <i class="bx bx-trash"></i> Delete
            </button>
        </div>
    </div>`;
}

// ====================== MODALS ======================
// OPEN add modal
function openAddModal() {
    modalTitle.innerHTML = "<i class='bx bx-plus'></i> Add Movie";
    editId.value = '';

    // Clear all inputs explicitly
    titleInput.value = '';
    genreInput.value = '';
    yearInput.value = '';
    ratingInput.value = '';
    descriptionInput.value = '';

    movieModal.classList.add('active');
}

// OPEN edit modal
async function openEditModal(id) {
    const response = await fetch(API_URL + '/' + id);
    const movie = await response.json();

    modalTitle.innerHTML = "<i class='bx bx-pencil'></i> Edit Movie";
    editId.value = movie.id;

    titleInput.value = movie.title || '';
    genreInput.value = movie.genre || '';
    yearInput.value = movie.year || '';
    ratingInput.value = movie.rating || '';
    descriptionInput.value = movie.description || '';

    movieModal.classList.add('active');
}

// CLOSE modal
function closeModal() {
    movieModal.classList.remove('active');
    editId.value = '';

    // Clear all inputs explicitly
    titleInput.value = '';
    genreInput.value = '';
    yearInput.value = '';
    ratingInput.value = '';
    descriptionInput.value = '';
}

// DELETE modal open
function openDeleteModal(id) {
    deleteId.value = id;
    deleteModal.classList.add('active');
}

// DELETE modal close
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteId.value = '';
}

// CONFIRM delete
function confirmDeleteAction() {
    const id = parseInt(deleteId.value);
    if (id) deleteMovie(id);
}

// ====================== FORM SUBMIT ======================
movieForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        title: titleInput.value.trim(),
        genre: genreInput.value,
        year: parseInt(yearInput.value) || 0,
        rating: parseFloat(ratingInput.value) || 0,
        description: descriptionInput.value.trim()
    };

    if (!data.title || !data.genre) return;

    const id = editId.value;

    if (id) {
        updateMovie(parseInt(id), data);
    } else {
        createMovie(data);
    }
});

// CLOSE modals when clicking outside
movieModal.addEventListener('click', function(e) {
    if (e.target === movieModal) closeModal();
});

deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) closeDeleteModal();
});

// INITIAL LOAD
document.addEventListener('DOMContentLoaded', fetchMovies);