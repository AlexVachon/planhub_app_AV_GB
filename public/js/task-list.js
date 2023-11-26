const projectId = document.querySelector('#projectID').getAttribute('data-projectId')
const userId = document.querySelector('#userID').getAttribute('data-userId')

const menuAside = document.getElementById('Menu-Aside')
const taskContent = document.getElementById('Task-Content')
const userContent = document.getElementById('User-Content')

const taskTypeOptions = ['Bug', 'Correction', 'Sprint', 'Tester', 'Travail', 'Urgence'];
const taskEtatOptions = ['À faire','En cours','En attente','À vérifier','En pause','Complété', 'Annulé'];

const taskNameInput = document.getElementById('ed_task_name');
const taskTypeSelect = document.getElementById('ed_task_type');
const taskDescriptionTextArea = document.getElementById('ed_task_description');
const taskIDHidden = document.getElementById('taskID')



function HTMLContentMenuTasks(tasks) {
    menuAside.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = `/projects/${projectId}/${task._id}`;
        a.classList.add('d-flex', 'justify-content', 'align-items-center', 'no-link-style');
        a.style.whiteSpace = 'nowrap'

        a.innerHTML = `
            <div>
                <img id="folder" src="/images/task.png" alt="task">
            </div>
            <div class="text-white nav-link px-0 align-middle">
                <span class="ms-1 d-none d-sm-inline">${task.task_name}</span>
            </div>
        `
        a.addEventListener('mouseover', () => {
            a.style.position = 'relative';
            a.style.display = 'inline-block';

            const pseudoElement = document.createElement('span')
            pseudoElement.textContent = task.task_name
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

        a.addEventListener('mouseout', () => {
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


function HTMLContentTaskContent(tasks){
    taskContent.innerHTML = ''
    if (tasks && tasks.length > 0){
        const ul = document.createElement('ul')
        ul.classList.add('list-group', 'shadow')
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('bg-secondary-subtle', 'text-dark', 'list-group-item');
            
            li.innerHTML = 
            `
            <div class="row">
                <div class="col-6">
                    <div class="border-right pr-3" style="position: relative;  flex-grow: 1;">
                        <div class="badge bg-secondary rounded-pill me-2">
                            ${task.task_subtasks.length}
                        </div>
                        <a class="stretched-link no-link-style" href="/projects/${projectId}/${task._id}">${task.task_name}</a>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row">
                        <div class="col-4">
                            <p class="mb-0">${taskEtatOptions[task.task_etat]}</p>
                        </div>
                        <div class="col-4">
                            <p class="mb-0">${taskTypeOptions[task.task_type]}</p>
                        </div>
                        <div class="col-4">
                            <div class="d-flex justify-content-end">
                                <img id="edit" src="/images/edit.png" alt="edit">
                                <img id="delete" src="/images/delete.png" alt="delete">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            const imgEdit = li.querySelector('#edit');
            const form = document.getElementById('editTaskModal')

            imgEdit.addEventListener('click', (event) => {
                event.preventDefault()
                if (form) {
                    form.style.display = 'block';
                    taskNameInput.value = task.task_name;
                    taskTypeSelect.value = task.task_type;
                    taskDescriptionTextArea.value = task.task_description;
                    taskIDHidden.value = task._id
                }
            });

            const closeFormButton = document.querySelector('#editTaskModal .close');

            if (closeFormButton) {
                closeFormButton.addEventListener('click', (event) => {
                    const form = document.getElementById('editTaskModal');
                    if (form) {
                        form.style.display = 'none';
                    }
                });
            }

            ul.appendChild(li);
        });
        taskContent.append(ul)

        

    }else{
        taskContent.innerHTML = 
        `
        <div class="text-center">
            <p class="text-center">Vous n'avez actuellement aucune tâche...</p>
        </div>
        `
    }
}

function HTMLContentUserContent(users, admins) {
    userContent.innerHTML = '';

    if (users.length > 1) {
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'shadow');

        users.forEach(utilisateur => {
            const li = document.createElement('li');
            li.classList.add('bg-secondary-subtle', 'text-dark', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            
            const div = document.createElement('div');
            
            const a = document.createElement('a');
            a.classList.add('stretched-link', 'no-link-style');
            a.href = '#users/' + utilisateur._id;
            a.textContent = utilisateur.first_name + ' ' + utilisateur.last_name;
            
            div.appendChild(a);

            if (admins.some(admin => admin._id === utilisateur._id)) {
                const span = document.createElement('span');
                span.textContent = ' (Admin)';
                div.appendChild(span);
            }

            li.appendChild(div);
            ul.appendChild(li);
        });

        userContent.appendChild(ul);
    } else if (users.length === 1) {
        userContent.innerHTML = `
            <div class="text-center">
                <p class="text-center">Vous êtes le seul utilisateur dans le projet.</p>
            </div>
        `;
    } else {
        userContent.innerHTML = `
            <div class="text-center">
                <p class="text-center">Il n'y a actuellement aucun utilisateur dans le projet.</p>
            </div>
        `;
    }
}


async function AppelTasks(){

    try {
        return await envoyerRequeteAjax(
            url = `/api/v1/tasks/${userId}/${projectId}/tasks`,
            methode = "GET",
        )

    } catch (error) {
        console.error(error)
    }
}

async function AppelUsers(){

    try {
        return await envoyerRequeteAjax(
            url = `/api/v1/tasks/${userId}/${projectId}/users`,
            methode = "GET",
        )

    } catch (error) {
        console.error(error)
    }
}

async function AppelAdmins(){

    try {
        return await envoyerRequeteAjax(
            url = `/api/v1/tasks/${userId}/${projectId}/admins`,
            methode = "GET",
        )

    } catch (error) {
        console.error(error)
    }
}

async function AfficherListeMenu(){

    try {
        const tasks = await AppelTasks()

        if (tasks.constructor === [].constructor){
            HTMLContentTaskContent(tasks)
            HTMLContentMenuTasks(tasks)
        } 
        const users = await AppelUsers()
        const admins = await AppelAdmins()

        if (users.constructor === [].constructor){
            HTMLContentUserContent(users, admins)
        } 
    } catch (error) {
        console.error(error)
    }
}

function initialize(){
    setInterval(AfficherListeMenu, 1000)
}
window.addEventListener('load', initialize)