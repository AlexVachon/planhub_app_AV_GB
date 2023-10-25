/**
 * Script pour se connecter à notre compte
 */


const input_email = document.getElementById("connect_email")
const input_password = document.getElementById("connect_password")

const myToastAlert = document.getElementById('toast-alert')
const toastAlert = new bootstrap.Toast(myToastAlert)

const myToastLogout = document.getElementById('toast-logout')
const toastLogout = new bootstrap.Toast(myToastLogout)

const params = new URLSearchParams(window.location.search)
if (params.get('logout') === 'true'){
    toastLogout.show()
}


function afficherMessage() {
    toastAlert.show()
    input_email.classList.remove("is-invalid")
    input_email.classList.add("is-invalid")
}

async function gererSubmit(e) {
    e.preventDefault()
    try {
        const connect_email = input_email.value
        const connect_password = input_password.value

        const response = await envoyerRequeteAjax(
            '/join/login',
            'POST',
            {
                user_email: connect_email,
                user_password: connect_password
            }
        )
        
        window.location = response.url

    } catch (error) {
        afficherMessage()
    }
}

/**
 * Initialisation de la fenêtre
 */
function initialize() {
    toastAlert.hide()
    document.querySelector("form").addEventListener("submit", gererSubmit)
}

window.addEventListener('load', initialize)
