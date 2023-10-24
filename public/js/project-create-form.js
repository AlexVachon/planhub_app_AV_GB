/**
 * Gestion d'un formulaire 'Pop-Up'
 */

const createProjectButtons = document.querySelectorAll('.createProjectButton');
const createProjectModal = document.getElementById('createProjectModal');
const closeButton = document.querySelector('.close');

createProjectButtons.forEach(button => {
  button.addEventListener('click', () => {
    createProjectModal.style.display = 'block';
  });
});

closeButton.addEventListener('click', () => {
  createProjectModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === createProjectModal) {
    createProjectModal.style.display = 'none';
  }
});
