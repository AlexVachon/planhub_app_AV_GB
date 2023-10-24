/**
 * Script pour se connecter à notre compte
 */


const input_email = document.getElementById("connect_email")
const input_password = document.getElementById("connect_password")

const myToast = document.getElementById('notifications')
const toast = new bootstrap.Toast(myToast)

function afficherMessage() {
    toast.show()
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
    toast.hide()
    document.querySelector("form").addEventListener("submit", gererSubmit)
}

window.addEventListener('load', initialize)
