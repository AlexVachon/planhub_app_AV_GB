
const input__project_name = document.getElementById('project_name')
const regexPN = /^.{4,25}$/

const loading_gif = document.getElementById('loading-project-form')

function resetValue(){
    input__project_name.value = ""
}

function validation(value){
    if(regexPN.test(value)){
        input__project_name.classList.remove('is-invalid')
        input__project_name.classList.add('is-valid')
        return true
    }else{
        input__project_name.classList.remove('is-valid')
        input__project_name.classList.add('is-invalid')
        return false
    }
}

async function gestionForm(e){
    e.preventDefault()
    loading_gif.hidden = false
    try {
        await new Promise(r => setTimeout(r, 1000));
        
        const name_value = input__project_name.value.trim()
        
        if(validation(name_value)){
            const project = await envoyerRequeteAjax(
                url = `/project/create`,
                methode = 'POST',
                {
                    project_name : name_value
                }
            )
           
            if (project){

                createProjectModal.style.display = 'none';
                  
                const myToast = document.getElementById('notifications')
                myToast.innerHTML = 
                `
                <div class="toast-header">
                    <strong class="me-auto text-success">Confirmation !</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body text-body-dark">
                    Projet: ${project.project_name} Ajouté
                </div>
                `
                const toast = new bootstrap.Toast(myToast)
                toast.show()
            }
        }
        loading_gif.hidden = true
    } catch (error) {
        console.error(error)
    }
}

/**
 * Initialise les fonctions de la page
 */
function initialize(){
    resetValue()
    document.getElementById('form-create-project').addEventListener('submit', gestionForm)
}
window.addEventListener('load', initialize)