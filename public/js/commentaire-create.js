function gestionSubmitCommentaires(event) {
    event.preventDefault();

    const message = document.getElementById("comment").value;

    const taskId = document.getElementById("taskId").dataset.taskid;
    
    fetch('/api/v1/comments/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            //comment_user: userId,
            comment_message: message,
            comment_task: taskId,
        }),
    })
    .then(response => {
        if (response.ok) {
            console.log("Commentaire ajouté avec succès");
            document.getElementById("comment").value = "";
            window.location.reload();
        } else {
            console.error("Erreur lors de l'ajout du commentaire");
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête AJAX :", error);
    });
}

function initialisation() {
    const formCommentaire = document.getElementById("form-commentaire");

    formCommentaire.addEventListener("submit", gestionSubmitCommentaires);
}

window.addEventListener('load', initialisation);
