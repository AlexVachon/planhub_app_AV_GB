/**
 * Script pour formulaire creer un compte et/ou se connecter
 */


let card = null
let lien = null
let estFormLogin = true



function formLogin() {
    estFormLogin = true
    card.innerHTML = `
    
    <div class="card-header">
        <h5>
            S’identifier
        </h5>
        <h6 class="card-subtitle mb-2 text-body-primary">Organisez vos projets scolaires/professionnels simplement</h6>
    </div>
    <div class="card-body">
        <form class="form-join" id="form-login" method="post" action="/join/login" novalidate>
            <div class="mb-3">
                <label for="connect_email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="connect_email" name="connect_email">
            </div>
            <div class="mb-3">
                <label for="connect_password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" id="connect_password" name="connect_password">
            </div>
            <button type="submit" class="btn btn-primary">S'identifier</button>
        </form>
    </div>
    <div class="card-footer">
        <p>Vous débutez sur PlanHub ?<a id="lien-join" href=""> S’inscrire</a></p>
    </div>
    
    `
    lien = document.getElementById('lien-join').addEventListener('click', gererClic)
}

function formSignIn(){
    estFormLogin = false
    card.innerHTML =  `
    <div class="card-header">
        <h5>
            Création d'un compte
        </h5>
        <h6 class="card-subtitle mb-2 text-body-primary">Créez-vous un compte pour rejoindre notre communauté!</h6>
    </div>
    <div class="card-body">
        <form class="form-join" id="form-sign" action="/join/sign" method="post" novalidate>
            <div class="mb-3">
                <label for="sign_first_name" class="form-label">Prénom</label>
                <input class="form-control" type="text" name="sign_first_name" id="sign_first_name" max="50" min="3">
            </div>
            <div class="mb-3">
                <label for="sign_last_name" class="form-label">Nom</label>
                <input class="form-control" type="text" name="sign_last_name" id="sign_last_name" max="50" min="3">
            </div>
            <div class="mb-3">
                <label for="sign_username" class="form-label">Nom d'utilisateur</label>
                <input class="form-control" type="text" name="sign_username" id="sign_username" max="20" min="8">
            </div>
            <div class="mb-3">
                <label for="sign_email" class="form-label">E-mail</label>
                <input class="form-control" type="email" name="sign_email" id="sign_email" max="100">
            </div>
            <div class="mb-3"
                <label for="sign_password" class="form-label">Mot de passe</label>
                <input class="form-control" type="password" name="sign_password" id="sign_password" max="20" min="8">
            </div>
            <div class="mb-3">
                <label for="sign_password_confirm" class="form-label">Confirmation mot de passe</label>
                <input class="form-control" type="password" name="sign_password_confirm" id="sign_password_confirm" max="20" min="8">
            </div>
            <button type="submit" class="btn btn-primary">Créer Compte</button>
        </form>
    </div>
    <div class="card-footer">
        <p>Vous avez déjà un compte ?<a id="lien-join" href="#"> S'identifier</a></p>
    </div>
    `
    lien = document.getElementById('lien-join').addEventListener('click', gererClic)
}

function gererClic(e){
    e.preventDefault()
    if (estFormLogin)
        formSignIn()
    else
        formLogin()
    
}


/**
 * Initialisation de la page
 */
function initialize() {
    card = document.getElementById('card-join')
    setTimeout(formLogin, 500)
}

window.addEventListener('DOMContentLoaded', initialize)