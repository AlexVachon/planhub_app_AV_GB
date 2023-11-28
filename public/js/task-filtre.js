const searchInput = document.getElementById('searchTerm');
const typeSelect = document.getElementById('type');
const etatSelect = document.getElementById('etat');
const triRadio = document.querySelector('input[name="tri"]:checked');


async function afficherRecherchesFiltrees(e) {
    e.preventDefault();

    const searchTerm = searchInput.value;
    const selectedType = typeSelect.value;
    const selectedEtat = etatSelect.value;
    const selectedTri = triRadio ? triRadio.value : '0';

    try {
        const response = await fetch(`/api/v1/tasks/search?projectId=${projectId}&searchTerm=${searchTerm}&type=${selectedType}&etat=${selectedEtat}&tri=${selectedTri}`);
        const data = await response.json();

        const rechercheTasks = data.tasks.filter(task => task.task_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const newUrl = `/projects/${projectId}?searchTerm=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(selectedType)}&etat=${encodeURIComponent(selectedEtat)}&tri=${encodeURIComponent(selectedTri)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        document.getElementById('parametreRecherche').style.display = 'none'

        HTMLContentTaskContent(rechercheTasks);
    } catch (error) {
        console.error(error);
    }
}


function initialisation() {

    const filterImage = document.getElementById('filter');
    const parametreRechercheModal = document.getElementById('parametreRecherche');

    filterImage.addEventListener('click', () => {
        parametreRechercheModal.style.display = 'block';
    });

    const closeButtonParametreRecherche = document.querySelector('#parametreRecherche .close');
    closeButtonParametreRecherche.addEventListener('click', () => {
        parametreRechercheModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === parametreRechercheModal) {
            parametreRechercheModal.style.display = 'none';
        }
    });

    parametreRechercheModal.addEventListener("submit", afficherRecherchesFiltrees);
}

window.addEventListener('load', initialisation);