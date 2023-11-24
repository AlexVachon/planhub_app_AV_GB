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
async function afficherRecherches(e) {
    e.preventDefault();

    const searchInput = document.getElementById('barre-recherche');
    const searchTerm = searchInput.value;

    try {
        const response = await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${searchTerm}`);
        const data = await response.json();

        const rechercheTasks = data.tasks.filter(task => task.task_name.toLowerCase().includes(searchTerm.toLowerCase()));

        // Mettez à jour l'URL avec le terme de recherche
        const newUrl = window.location.href.split('?')[0] + `?searchTerm=${encodeURIComponent(searchTerm)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        HTMLContentTaskContent(rechercheTasks);
    } catch (error) {
        console.error(error);
    }
}


/**
 * Pour demander les suggestions au site web.
 *
 * On devrait procéder par AJAX pour récupérer les suggestions, mais
 * elles sont "hard-codés" pour la démo.
 */
async function afficherSuggestions() {
    const searchInput = document.getElementById('barre-recherche');
    const divSuggestions = document.getElementById('div-suggestions');

    const searchTerm = searchInput.value;
    
    if (searchTerm.trim() !== '' && searchTerm.length >=3) {
        const response = (await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${searchTerm}`));
        const data = await response.json();
        
        if (data.tasks && data.tasks.length > 0){

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

        document.addEventListener("click", gererClicFenetre)
        } else{
            divSuggestions.replaceChildren();
            divSuggestions.classList.remove('afficher');
        }
    } else {
        divSuggestions.classList.add('masquer');
    }
 }

 function initialisation() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
        document.getElementById('barre-recherche').value = searchTermFromUrl;
        afficherRecherches({ preventDefault: () => {} });
    }

    document
        .getElementById("form-recherche")
        .addEventListener("submit", afficherRecherches)

    document
        .getElementById("form-recherche")
        .addEventListener("input", afficherSuggestions)
 }


window.addEventListener('load', initialisation)