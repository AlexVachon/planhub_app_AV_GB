function ListeCommentaires(v){
    list_content.innerHTML = ''
    if (v && v.length > 0){
        const ul = document.createElement('ul')
        ul.classList.add('list-group', 'shadow')
        v.forEach(value => {
            const li = document.createElement('li');
            li.classList.add('bg-secondary-subtle', 'text-dark', 'list-group-item');
            
            // Création du contenu HTML pour chaque tâche
            li.innerHTML = 
            `
            <div class="row">
                <div class="col-4">
                    <div class="border-right pr-3" style="position: relative;  flex-grow: 1;">
                        <a class="stretched-link no-link-style">${value.subtask_name}</a>
                    </div>
                </div>
                <div class="col-8">
                    <div class="row">
                        <div class="col-4">
                            <p class="mb-0">${taskEtatOptions[value.subtask_etat]}</p>
                        </div>
                        <div class="col-5">
                            <p class="mb-0">${taskTypeOptions[value.subtask_type]}</p>
                        </div>
                        <div class="col-3">
                            <div class="d-flex justify-content-end">
                                <img id="edit" src="/images/edit.png" alt="edit">
                                <img id="delete" src="/images/delete.png" alt="delete">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            ul.appendChild(li);
        });
        list_content.append(ul)
    }else{
        list_content.innerHTML = 
        `
        <div class="text-center">
            <p class="text-center">Vous n'avez actuellement aucune sous-tâche...</p>
        </div>
        `
    }
}

async function ChargerCommentaires(){
    try {
        const subtasks = await envoyerRequeteAjax(
            url = `/api/v1/subtasks/${document.getElementById("taskId").dataset.taskid}/`,
            methode='GET'
        )
        if(subtasks.constructor === [].constructor){
            AfficherListeSubtask(subtasks)
        }
    } catch (error) {
        console.error(error)
    }
}


function initialize(){
    ChargerCommentaires()
}
window.addEventListener('load', initialize)