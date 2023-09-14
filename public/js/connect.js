/**
 * Script pour creer un compte et/ou se connecter
 */


/**
 * Permet de connecter l'utilisateur
 * @param {*} e Évènement submit
 */
async function connectUser(e){
    e.preventDefault()

    const email = document.getElementById('connect_email')
    const password = document.getElementById('connect_password')
    
    try {
        const connected_user = await envoyerRequeteAjax(
            url = '/api/v1/users/user',
            methode = 'POST',
            parametres = {
                'user_email': email,
                'user_password': password
            }
        )
        if(connected_user['user'] != null){

        }


    } catch (error) {
        
    }
}


/**
 * Initialisation de la page
 */
function initialize(){

    document.getElementById('form_connect').addEventListener('submit', connectUser)

}

window.addEventListener('load', initialize)