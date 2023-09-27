/**
 * Script pour se connecter à notre compte
 */

// const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// const regexPW = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{1,20}$/

const input_email = document.getElementById("connect_email")
const input_password = document.getElementById("connect_password")

const notifications = document.getElementById("notifications")


function afficherMessage(input, valide){
    if (valide){
        input.classList.remove("is-invalid")
        input.classList.add("is-valid")
    }else{
        input.classList.remove("is-valid")
        input.classList.add("is-invalid")
        input.value = ""
    }
}

async function gererSubmit(e){
    e.preventDefault()
    try {
        const connect_email = input_email.value
        const connect_password = input_password.value

        const confirm_email = await envoyerRequeteAjax(
            '/join/confirm/email',
            'POST',
            {
                confirm_email: connect_email
            }
        )
        if(confirm_email){
            afficherMessage(input_email, true)
            try{
                const user = await envoyerRequeteAjax(
                    '/join/login',
                    'POST',
                    {
                        connect_email: connect_email,
                        connect_password: connect_password
                    }
                )
                console.log(user)
            }catch(e){
                afficherMessage(input_password, false)
            }
        }
        
    } catch (error) {
        afficherMessage(input_email, false)
    }
}

/**
 * Initialisation de la fenêtre
 */
function initialize(){
    document.querySelector("form").addEventListener("submit", gererSubmit)
}

window.addEventListener('load', initialize)
