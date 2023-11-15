function gestionTabs() {
  const tabs = document.querySelectorAll(".nav-link");
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function(event) {
      event.preventDefault();

      // Masquer tous les contenus d'onglet
      const tabContents = document.querySelectorAll('.tab-pane');
      tabContents.forEach(function(content) {
        content.classList.remove('show', 'active');
      });

      // Retirer la classe "active" de tous les onglets
      tabs.forEach(function(tab) {
        tab.classList.remove('active');
      });

      // Récupérer l'ID de l'onglet correspondant au lien cliqué
      const tabId = this.getAttribute('href');

      // Afficher le contenu de l'onglet correspondant
      document.querySelector(tabId).classList.add('show', 'active');

      // Ajouter la classe "active" à l'onglet cliqué
      this.classList.add('active');
    });
  });
}

window.addEventListener("load", gestionTabs);
