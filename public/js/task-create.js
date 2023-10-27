/**
 * Gestion de la création d'une tâche
 */

const input_tn = document.getElementById('task_name')
const input_tt = document.getElementById("task_type")
const input_td = document.getElementById("task_description")

const regexTN = /^[A-Za-z0-9\s]+$/

/**
 * Permet de valider le champs dans le formulaire
 */
function validateInputTN(value){
    if (regexTN.test(value)){
        input_tn.classList.remove('is-invalid')
        input_tn.classList.add('is-valid')

        return true
    }else{
        input_tn.classList.remove('is-valid')
        input_tn.classList.add('is-invalid')

        return false
    }
}


/**
 * Permet de gérer le submit du formulaire
 */
async function gestionSubmit(e){
    e.preventDefault()
    try {
        const name = input_tn.value.trim()
        const type = input_tt.value.trim()
        const description = input_td.value.trim()

        if (validateInputTN(name)){
            const reponse = await envoyerRequeteAjax(
                url=`/api/v1/tasks/create`,
                methode='POST',
                parametres={
                    task_name: name,
                    task_type: type,
                    task_description: description 
                }
            )
        }
        
        
    } catch (error) {
        console.error(error)
    }
}


/**
 * Initialise les fonctions de la page
 */
function Initialize(){
    document.getElementById('form-create-task').addEventListener('submit', gestionSubmit)
}
window.addEventListener('load', Initialize)