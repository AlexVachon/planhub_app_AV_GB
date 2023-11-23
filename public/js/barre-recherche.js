/**
 * Appelée lors d'un clic dans la fenêtre.
 */
function gererClicFenetre(evenement) {
    const clicDansDivision = divSuggestions.contains(evenement.target);
    console.log("Clic dans la zone cliquable ? " + clicDansDivision)

    if (!clicDansDivision) {
        divSuggestions.replaceChildren()
        divSuggestions.classList.remove("afficher")
        document.removeEventListener("click", gererClicFenetre)
    }
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
    const divSuggestions = document.getElementById('div-suggestions');

    const searchTerm = searchInput.value;
    
    if (searchTerm.trim() !== '' && searchTerm.length >=3) {
        const response = (await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${searchTerm}`));
        const data = await response.json();
        
        if (data.tasks.length > 0){

        divSuggestions.replaceChildren()

        divSuggestions.classList.add("afficher")

        const ulSuggestions = document.createElement("ul")
        divSuggestions.appendChild(ulSuggestions)

        let nombreSuggestion = 0;

        if (data.tasks){
            for (let tache of data.tasks) {
            nombreSuggestion += 1
            if (nombreSuggestion <= 5){
                const liSuggestion = document.createElement("li")
                
                const aSuggestion = document.createElement("a")
                aSuggestion.classList.add("no-link-style")

                aSuggestion.setAttribute("href", "/projects/" + projectId + "/" + tache._id)
                aSuggestion.textContent = tache.task_name

                liSuggestion.appendChild(aSuggestion)
                ulSuggestions.appendChild(liSuggestion)
            }
        }
        }

        // Ajout d'un événement sur tout le document (la fenêtre)
        document.addEventListener("click", gererClicFenetre)
        } else {
            console.log("NOPE")
            //divSuggestions.innerHTML = data.tasks.map(task => `<p>${task.task_name}</p>`).join('');
        }
    } else {
        divSuggestions.classList.add('masquer');
    }
 }

 function initialisation() {
    document
        .getElementById("form-recherche")
        .addEventListener("submit", afficherRecherches)

    document
        .getElementById("form-recherche")
        .addEventListener("input", afficherSuggestions)
 }


window.addEventListener('load', initialisation)