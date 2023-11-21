/**
 * Permet d'obtenir la liste des suggestions des recherches
 * @param checkpoint Le nombre de card qui est affiché en ce moment
 * @param chercher Le mot de la recherch
 * @returns {Promise<*>}Une liste des suggestions
 */
async function obtenirSuggestions(checkpoint, chercher){
    // Envoyez une requête AJAX pour récupérer les suggestions
    const response = await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${chercher}`);
    const data = await response.json();

    // Retournez les suggestions obtenues
    return data.tasks;
}


/**
 * Appelée lors d'un clic dans la fenêtre.
 */
function gererClicFenetre(evenement) {
    
}

/**
 * Pour afficher les résultats de la recherche.
 */
async function afficherRecherches(e){
    const searchInput = document.getElementById('recherche');
    const suggestionsDiv = document.getElementById('div-suggestions');

    const searchTerm = searchInput.value;

    // Vérifiez que le terme de recherche n'est pas vide
    if (searchTerm.trim() !== '') {
        // Obtenez les suggestions en appelant obtenirSuggestions
        const suggestions = await obtenirSuggestions(quelqueCheckpoint, searchTerm);

        // Affichez les suggestions dans la div appropriée (div-suggestions)
        suggestionsDiv.innerHTML = suggestions.map(task => `<p>${task.task_name}</p>`).join('');
        suggestionsDiv.classList.remove('masquer'); // Assurez-vous que la div n'est pas masquée
    } else {
        // Si le terme de recherche est vide, masquez la div de suggestions
        suggestionsDiv.classList.add('masquer');
    }
}

/**
 * Pour demander les suggestions au site web.
 *
 * On devrait procéder par AJAX pour récupérer les suggestions, mais
 * elles sont "hard-codés" pour la démo.
 */
async function afficherSuggestions() {
    const searchInput = document.getElementById('form-recherche');
    const suggestionsDiv = document.getElementById('div-suggestions');

    const searchTerm = searchInput.value;

    // Vérifiez que le terme de recherche n'est pas vide
    if (searchTerm.trim() !== '') {
        // Envoyez une requête AJAX pour récupérer les suggestions
        const response = await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${searchTerm}`);
        const data = await response.json();

        // Affichez les suggestions dans la div appropriée (div-suggestions)
        suggestionsDiv.innerHTML = data.tasks.map(task => `<p>${task.task_name}</p>`).join('');
        suggestionsDiv.classList.remove('masquer'); // Assurez-vous que la div n'est pas masquée
    } else {
        // Si le terme de recherche est vide, masquez la div de suggestions
        suggestionsDiv.classList.add('masquer');
    }
 }

 function initialisation() {
    document
        .getElementById("form-recherche")
        .addEventListener("submit", afficherRecherches)

    document
        .getElementById("div-suggestions")
        .addEventListener("input", afficherSuggestions)
 }


window.addEventListener('load', initialisation)