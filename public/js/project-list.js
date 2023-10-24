const userID = document.getElementById('userID').dataset.userid

const menu = document.getElementById('menu')
const mainContent = document.getElementById('mainContent')

function HTMLContentMenu(projects) {
    menu.innerHTML = '';
    for (project of projects) {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.href = `/projects/${project._id}`;
        a.classList.add('d-flex', 'justify-content', 'align-items-center', 'no-link-style');

        a.innerHTML = `
            <div>
                <img id="folder" src="../images/folder_logo.png" alt="folder">
            </div>
            <div class="text-white nav-link px-0 align-middle">
                <span class="ms-1 d-none d-sm-inline">${project.project_name}</span>
            </div>
        `;

        li.appendChild(a);
        menu.appendChild(li);
    }
}


function HTMLContentMainContent(projects){
    mainContent.innerHTML = ''
    if (projects){
        for(project of projects){
            const ul = document.createElement('ul')
            ul.classList.add('list-group', 'shadow')
            ul.innerHTML = 
            ` <li class="bg-secondary-subtle text-dark list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <a href="/projects/${project._id}" class="stretched-link no-link-style">${project.project_name}</a>
                </div>
                <div>
                    <img id="edit" src="../images/edit.png" alt="folder">
                    <img id="delete" src="../images/delete.png" alt="folder">
                </div>
            </li>
            `
            mainContent.appendChild(ul)
        }
    }else{
        mainContent.innerHTML = 
        `
        <div class="text-center">
            <p class="text-center">Vous n'avez aucun projet pour le moment...</p>
        </div>
        <div class="container d-flex justify-content-center align-items-center">
            <button type="button" id="createProjectButton" class="createProjectButton btn btn-lg btn-outline-secondary" style="border-radius: 10px">Créer un projet</button>
        </div>
        `
    }
}


async function AfficherListeMenu(){

    try {
        const projects = await envoyerRequeteAjax(
            url = `/project/${userID}/projects`,
            methode = "GET",
        )
        if (projects){
            HTMLContentMenu(projects)
            HTMLContentMainContent(projects)
        }

    } catch (error) {
        console.error(error)
    }
}

function initialize(){
    AfficherListeMenu()
    setInterval(AfficherListeMenu, 1000)
}
window.addEventListener('load', initialize)