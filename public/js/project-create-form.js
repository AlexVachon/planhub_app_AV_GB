const createProjectButton = document.getElementById('createProjectButton');
const createProjectModal = document.getElementById('createProjectModal');
const closeButton = document.querySelector('.close');

createProjectButton.addEventListener('click', () => {
  createProjectModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  createProjectModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === createProjectModal) {
    createProjectModal.style.display = 'none';
  }
});
