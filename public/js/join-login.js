/**
 * Script pour se connecter à notre compte
 */

let form = null

async function gererSubmit(e){
    e.preventDefault()
    try {
        const connect_email = document.getElementById("connect_email").value
        const connect_password = document.getElementById("connect_password").value

        const user = await envoyerRequeteAjax(
            url = '/join/login',
            methode = 'POST',
            parametres = {
                connect_email: connect_email,
                connect_password: connect_password
            }
        )
        console.log(user)
    } catch (error) {
        console.log(error)
    }

}


/**
 * Initialisation de la fenêtre
 */
function initialize(){
    form = document.querySelector("form")
    form.addEventListener("submit", gererSubmit)      
}
window.addEventListener('load', initialize)