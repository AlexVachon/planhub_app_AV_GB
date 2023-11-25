const inputEdName = document.getElementById("ed_project_name");
const formEdit = document.getElementById("form-edit-project");

function validate(value) {
  if (regexPN.test(value)) {
    setValidationClasses(true);
    return true;
  } else {
    setValidationClasses(false);
    return false;
  }
}

function setValidationClasses(isValid) {
  inputEdName.classList.remove(isValid ? "is-invalid" : "is-valid");
  inputEdName.classList.add(isValid ? "is-valid" : "is-invalid");
}

async function gestionSubmitEdit(e) {
  e.preventDefault();

  try {
    const name = inputEdName.value.trim();

    if (validate(name)) {
      const response = await envoyerRequeteAjax(
        `/project/${userID}/projects/${document.getElementById("projectID").value}/edit`,
        "POST",
        { name }
      );

      const toast = document.getElementById("notifications");
      const toastHeader = document.createElement("div");
      toastHeader.className = "toast-header";

      if (response.status == 'ok') {
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
      document.getElementById("editProjectModal").style.display = 'none'
    }
  } catch (error) {
    console.error(error);
  }
}

function initialize() {
  formEdit.addEventListener("submit", gestionSubmitEdit);
}
window.addEventListener("load", initialize);
