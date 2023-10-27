/**
 * Gestion d'un formulaire 'Pop-Up'
 */

const createTaskButtons = document.querySelectorAll('.createTaskButton');
const createTaskModal = document.getElementById('createTaskModal');
const closeButton = document.querySelector('.close');

createTaskButtons.forEach(button => {
  button.addEventListener('click', () => {
    createTaskModal.style.display = 'block';
  });
});

closeButton.addEventListener('click', () => {
    createTaskModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === createTaskModal) {
    createTaskModal.style.display = 'none';
  }
});