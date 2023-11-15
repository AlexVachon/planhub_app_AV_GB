const userID = document.getElementById("userID").dataset.userid;

const menu = document.getElementById("menu");
const mainContent = document.getElementById("mainContent");

function HTMLContentMenu(projects) {
  menu.innerHTML = "";
  projects.forEach((project) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `/projects/${project._id}`;
    a.classList.add(
      "d-flex",
      "justify-content",
      "align-items-center",
      "no-link-style"
    );
    a.style.whiteSpace = "nowrap";

    a.innerHTML = `
            <div>
                <img id="folder" src="/images/folder_logo.png" alt="folder">
            </div>
            <div class="text-white nav-link px-0 align-middle">
                <span class="ms-1 d-none d-sm-inline">${project.project_name}</span>
            </div>
        `;
    a.addEventListener("mouseover", () => {
      // Créer une portée distincte pour chaque élément
      a.style.position = "relative";
      a.style.display = "inline-block";

      const pseudoElement = document.createElement("span");
      pseudoElement.textContent = project.project_name;
      pseudoElement.style.position = "absolute";
      pseudoElement.style.left = "100%";
      pseudoElement.style.top = "0";
      pseudoElement.style.padding = "5px";
      pseudoElement.style.color = "gray";
      pseudoElement.style.backgroundColor = "#F6F6F6";
      pseudoElement.style.border = "1px solid #ccc";
      pseudoElement.style.zIndex = "1";
      pseudoElement.style.borderRadius = "10px";

      a.appendChild(pseudoElement);
    });

    // Écouteur d'événement pour gérer la fin du survol
    a.addEventListener("mouseout", () => {
      // Code à exécuter à la fin du survol
      a.style.position = "static";
      a.style.display = "block";
      const pseudoElement = a.querySelector("span");
      if (pseudoElement) {
        a.removeChild(pseudoElement);
      }
    });

    li.appendChild(a);
    menu.appendChild(li);
  });
}

function HTMLContentMainContent(projects) {
  mainContent.innerHTML = "";
  if (projects.length > 0) {
    const ul = document.createElement("ul");
    ul.classList.add("list-group", "shadow");
    for (project of projects) {
      ul.innerHTML += ` <li class="bg-secondary-subtle text-dark list-group-item d-flex justify-content-between align-items-center">
                <div style="position: relative; flex-grow: 1;">
                    <a href="/projects/${project._id}" class="stretched-link no-link-style">${project.project_name}</a>
                </div>
                <div>
                    <img id="edit" src="/images/edit.png" alt="image edit">
                    <img id="delete" src="/images/delete.png" alt="image delete">
                </div>
            </li>
            `;
      mainContent.appendChild(ul);
    }
  } else {
    mainContent.innerHTML = `
        <div class="text-center">
            <p class="text-center">Vous n'avez aucun projet pour le moment...</p>
        </div>
        `;
  }
}

async function AfficherListeMenu() {
  try {
    const projects = await envoyerRequeteAjax(
      (url = `/project/${userID}/projects`),
      (methode = "GET")
    );
    if (projects.constructor === [].constructor) {
      HTMLContentMenu(projects);
      HTMLContentMainContent(projects);
    }
  } catch (error) {
    console.error(error);
  }
}

function initialize() {
  setInterval(AfficherListeMenu, 1000);
}
window.addEventListener("load", initialize);
