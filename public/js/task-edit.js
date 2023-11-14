
const input_ed_name = document.getElementById('ed_task_name')
const input_ed_type = document.getElementById('ed_task_type')
const input_ed_description = document.getElementById('ed_task_description')

const form_edit = document.getElementById('form-edit-task')


function validate(value){
    if(regexTN.test(value)){
        input_ed_name.classList.remove('is-invalid')
        input_ed_name.classList.add('is-valid')
        return true
    }else{
        input_ed_name.classList.remove('is-valid')
        input_ed_name.classList.add('is-invalid')
        return false
    }
}

/**
 * Gestion du submit sur le formulaire
 * @param {*} e formulaire
 */
async function gestionSubmitEdit(e){
    e.preventDefault()

    try {
        const name = input_ed_name.value.trim()
        const type = input_ed_type.value.trim()
        const description = input_ed_description.value.trim()

        if(validate(name)){
            const reponse = await envoyerRequeteAjax(
                `/api/v1/tasks/${document.getElementById('projectID').dataset.projectid}/${taskIDHidden.value}/edit`,
                'POST',
                {
                    task_name: name,
                    task_type: type,
                    task_description: description
                }
            )
            document.getElementById('editTaskModal').style.display = 'none'
            console.log(reponse)

            const myToast = document.getElementById('notifications')
                myToast.innerHTML = 
                `
                <div class="toast-header">
                    <strong class="me-auto text-success">Confirmation !</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body text-body-dark">
                    Tâche modifiée
                </div>
                `
                const toast = new bootstrap.Toast(myToast)
                toast.show()
        }
        
    } catch (error) {
        console.error(error)
        document.getElementById('editTaskModal').style.display = 'none'
            console.log(reponse)

            const myToast = document.getElementById('notifications')
                myToast.innerHTML = 
                `
                <div class="toast-header">
                    <strong class="me-auto text-danger">Erreur !</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body text-body-dark">
                    Erreur lors de la modification
                </div>
                `
                const toast = new bootstrap.Toast(myToast)
                toast.show()
    }

}

function initialize(){
    form_edit.addEventListener('submit', gestionSubmitEdit)
}
window.addEventListener('load', initialize)