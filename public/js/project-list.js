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

    for (const project of projects) {
      const li = document.createElement("li");
      li.className =
        "bg-secondary-subtle text-dark list-group-item d-flex justify-content-between align-items-center";

      const linkContainer = document.createElement("div");
      linkContainer.style = "position: relative; flex-grow: 1;";

      const projectLink = document.createElement("a");
      projectLink.href = `/projects/${project._id}`;
      projectLink.className = "stretched-link no-link-style";
      projectLink.textContent = project.project_name;
      const taskCountContainer = document.createElement("div");
      taskCountContainer.className = "badge bg-secondary rounded-pill me-2";
      taskCountContainer.textContent = project.tasks.length;

      linkContainer.appendChild(taskCountContainer);
      linkContainer.appendChild(projectLink);

      const actionContainer = document.createElement("div");
      const form_edit = document.getElementById("editProjectModal");

      const editImage = document.createElement("img");
      editImage.src = "/images/edit.png";
      editImage.alt = "image edit";
      editImage.addEventListener("click", (event) => {
        event.preventDefault();
        if (form_edit) {
          form_edit.style.display = "block";
          document.getElementById("ed_project_name").value =
            project.project_name;
          document.getElementById("projectID").value = project._id;
        }
      });

      const deleteImage = document.createElement("img");
      deleteImage.src = "/images/delete.png";
      deleteImage.alt = "image delete";
      deleteImage.addEventListener("click", (event) => {
        event.preventDefault();

        const popoverContent = document.createElement("div");
        popoverContent.innerHTML = `
          <div>
            <p>Voulez-vous vraiment supprimer le projet: "${project.project_name}" ?</p>
            <form id="deleteForm">
              <input type="hidden" id="projectID" value="${project._id}"/>
              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-danger">Oui, supprimer</button>
                <button type="button" id="close" class="btn btn-secondary" aria-label="Close">Annuler</button>
              </div>
            </form>
          </div>
        `;

        const popover = new bootstrap.Popover(deleteImage, {
          title: "Confirmation de suppression",
          content: popoverContent,
          placement: "right",
          trigger: "manual",
          html: true,
        });

        popover.show();
        const closeButton = popoverContent.querySelector("#close");
        closeButton.addEventListener("click", () => {
          popover.hide();
        });

        const deleteForm = popoverContent.querySelector("#deleteForm");
        deleteForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          try {
            const response = await envoyerRequeteAjax(
              `/project/projects/${
                popoverContent.querySelector("#projectID").value
              }/delete`,
              "DELETE"
            );
            const toast = document.getElementById("notifications");
            const toastHeader = document.createElement("div");
            toastHeader.className = "toast-header";
            if (response.status == "ok") {
              toastHeader.innerHTML = `
                <strong class="me-auto text-success">Confirmation !</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              `;
            } else {
              toastHeader.innerHTML = `
                <strong class="me-auto text-danger">Erreur !</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              `;
            }

            const toastBody = document.createElement("div");
            toastBody.className = "toast-body text-body-dark";
            toastBody.textContent = response.message;

            toast.innerHTML = "";
            toast.appendChild(toastHeader);
            toast.appendChild(toastBody);

            const toastInstance = new bootstrap.Toast(toast);
            toastInstance.show();
            popover.hide();
          } catch (error) {
            console.error("Erreur lors de la suppression du projet", error);
          }
        });

        setTimeout(() => {
          popover.hide();
        }, 5000);
      });

      const closeEditFormButton = document.querySelector(
        "#editProjectModal .close"
      );

      if (closeEditFormButton) {
        closeEditFormButton.addEventListener("click", (event) => {
          form_edit.style.display = "none";
        });
      }

      actionContainer.appendChild(editImage);
      actionContainer.appendChild(deleteImage);

      li.appendChild(linkContainer);
      li.appendChild(actionContainer);

      ul.appendChild(li);
    }

    mainContent.appendChild(ul);
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
