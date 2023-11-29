const comments_list = document.getElementById('liste-commentaires');

function formatUserName(user) {
    if (user) {
        return `${user.first_name} ${user.last_name}`;
    } else {
        return "Utilisateur inconnu";
    }
}

const getUser = async (userId) => {
    const response = await fetch(`/api/v1/users/${userId}`);
    const user = await response.json();
    return user;
};

async function AfficherListeCommentaires(v) {
    comments_list.innerHTML = '';
    if (v && v.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'shadow');
        
        for (const value of v) {
            const li = document.createElement('li');
            li.classList.add('bg-secondary-subtle', 'text-dark', 'list-group-item');
            // Récupérer le nom de l'utilisateur
            try {
                const commentuser = await getUser(value.comment_user);
                const createdAtString = new Date(value.created_at).toLocaleString();


                // Création du contenu HTML pour chaque commentaire
                li.innerHTML = `
                    <div class="card-header d-flex justify-content-between">
                        <p class="m-0"><span class="text-secondary">${formatUserName(commentuser)}</span></p>
                        <p class="m-0"><span class="text-secondary">créé: ${createdAtString}</span></p>
                    </div>
                    <div class="card-body">
                        <p class="card-text text-dark">${value.comment_message}</p>
                    </div>
                `;

                ul.appendChild(li);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        comments_list.append(ul);
    } else {
        comments_list.innerHTML = `
            <div class="text-center">
                <p class="text-black text-center">Il n'y a pas de commentaire associé à la tâche...</p>
            </div>
        `;
    }
}


async function ChargerCommentaires() {
    try {
        const comments = await envoyerRequeteAjax(
            url = `/api/v1/comments/${document.getElementById("taskId").dataset.taskid}/`,
            methode = 'GET'
        )
        if (comments.constructor === [].constructor) {
            AfficherListeCommentaires(comments)
        }
    } catch (error) {
        console.error(error)
    }
}

function initialize() {
    ChargerCommentaires()
}
window.addEventListener('load', initialize)
