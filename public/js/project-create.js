
const input__project_name = document.getElementById('project_name')
const regexPN = /^.{4,25}$/


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

    try {
        const name_value = input__project_name.value.trim()

        if(validation(name_value)){
            await envoyerRequeteAjax(
                url = `/project/create`,
                methode = 'POST',
                {
                    project_name : name_value
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
function initialize(){
    resetValue()
    document.getElementById('form-create-project').addEventListener('submit', gestionForm)
}
window.addEventListener('load', initialize)