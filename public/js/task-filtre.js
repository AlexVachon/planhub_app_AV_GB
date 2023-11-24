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
}

window.addEventListener('load', initialisation);
