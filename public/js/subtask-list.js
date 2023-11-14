
const menuAside = document.getElementById('Menu-Aside')
const list_content = document.getElementById('Subask-Content')

const taskTypeOptions = ['Bug', 'Correction', 'Sprint', 'Tester', 'Travail', 'Urgence'];
const taskEtatOptions = ['À faire','En cours','En attente','À vérifier','En pause','Complété', 'Annulé'];

/**
 * Affiche les valeurs dans le menu aside
 * @param {*} v Valeurs à afficher 
 */
function MenuAside(v){
    menuAside.innerHTML = '';
    v.forEach((value) => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        // a.href = `/projects/${projectId}/${value._id}`; //A revoir
        a.classList.add('d-flex', 'justify-content', 'align-items-center', 'no-link-style');
        a.style.whiteSpace = 'nowrap'

        a.innerHTML = `
            <div>
                <img id="folder" src="/images/task.png" alt="task">
            </div>
            <div class="text-white nav-link px-0 align-middle">
                <span class="ms-1 d-none d-sm-inline">${value.subtask_name}</span>
            </div>
        `
        a.addEventListener('mouseover', () => {
            // Créer une portée distincte pour chaque élément
            a.style.position = 'relative';
            a.style.display = 'inline-block';

            const pseudoElement = document.createElement('span')
            pseudoElement.textContent = value.subtask_name
            pseudoElement.style.position = 'absolute'
            pseudoElement.style.left = '100%'
            pseudoElement.style.top = '0'
            pseudoElement.style.padding = '5px'
            pseudoElement.style.color = "gray"
            pseudoElement.style.backgroundColor = '#F6F6F6'
            pseudoElement.style.border = '1px solid #ccc'
            pseudoElement.style.zIndex = '1'
            pseudoElement.style.borderRadius = "10px"

            a.appendChild(pseudoElement);
        });

        // Écouteur d'événement pour gérer la fin du survol
        a.addEventListener('mouseout', () => {
            // Code à exécuter à la fin du survol
            a.style.position = 'static';
            a.style.display = 'block';
            const pseudoElement = a.querySelector('span');
            if (pseudoElement) {
                a.removeChild(pseudoElement);
            }
        });

        li.appendChild(a);
        menuAside.appendChild(li);
    })
}

/**
 * Affiches les valeurs dans le main content de la page
 * @param {*} v Valeurs à afficher
 */
function ListContent(v){
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

/**
 * Appel les fonctions pour afficher les SubTasks
 * @param {*} v Valeurs à afficher 
 */
function AfficherListeSubtask(v){
    MenuAside(v)
    ListContent(v)
}

/**
 * Charge les SubTasks dans la base de données appartenant à cette tâche
 */
async function ChargerSubtasks(){
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

/**
 * Initialisation de la page
 */
function initialize(){
    ChargerSubtasks()
}
window.addEventListener('load', initialize)