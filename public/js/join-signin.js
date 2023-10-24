/**
 * Permet de se créer un compte
 */


/**
 * REGEX sur les champs
 */
const regexFNLN = /^.{3,50}$/
const regexUN = /^[a-zA-Z0-9_]{8,20}$/
const regexEM = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const regexPW = /^.{8,}/

/**
 * Initialisation des inputs du formulaire
 */
const input_fn = document.getElementById("sign_first_name")
const input_ln = document.getElementById("sign_last_name")
const input_un = document.getElementById("sign_username")
const input_em = document.getElementById("sign_email")
const input_pw = document.getElementById("sign_password")
const input_pwc = document.getElementById("sign_password_confirm")

/**
 * Reset les values des champs au chargement de la page
 */
function resetValues() {
    input_fn.value = ""
    input_ln.value = ""
    input_un.value = ""
    input_em.value = ""
    input_pw.value = ""
    input_pwc.value = ""
}

/**
 * Verifier si tous les champs respectent les regex
 * @param  {...any} values Les valeurs à vérifier
 * @returns Vrai si tout est beau, sinon Faux
 */
function allGood(values) {
    return (
        regexFNLN.test(values[0]) &&
        regexFNLN.test(values[1]) &&
        regexUN.test(values[2]) &&
        regexEM.test(values[3]) &&
        values[4] == values[5]
    );
}

/**
 * Vérifie si le courriel est déjà utilisé
 */
async function emailUsed() {
    const isValid = await envoyerRequeteAjax(
        url = `/join/confirm/email_used`,
        methode = 'POST',
        {
            email: input_em.value
        }
    );

    if (!isValid) {
        input_em.classList.remove('is-invalid');
        input_em.classList.add('is-valid');
    } else {
        input_em.classList.remove('is-valid');
        input_em.classList.add('is-invalid');
    }

    return isValid;
}

/**
 * Vérifie si le nom d'utilisateur n'existe pas déjà
 */
async function usernameUsed() {
    const isValid = await envoyerRequeteAjax(
        url = `/join/confirm/username_used`,
        methode = 'POST',
        {
            username: input_un.value
        }
    );

    if (!isValid) {
        input_un.classList.remove('is-invalid');
        input_un.classList.add('is-valid');
    } else {
        input_un.classList.remove('is-valid');
        input_un.classList.add('is-invalid');
    }

    return isValid;
}


/**
 * Affiche les feedbacks sur chaque input
 * @param  {[]} values Valeurs à vérifier
 * @returns Vrai si tous les conditions sont respectées, sinon Faux
 */
function validationChamps(values) {
    if (regexFNLN.test(values[0])) {
        input_fn.classList.remove('is-invalid')
        input_fn.classList.add('is-valid')
    } else {
        input_fn.classList.remove('is-valid')
        input_fn.classList.add('is-invalid')
    }

    if (regexFNLN.test(values[1])) {
        input_ln.classList.remove('is-invalid')
        input_ln.classList.add('is-valid')
    } else {
        input_ln.classList.remove('is-valid')
        input_ln.classList.add('is-invalid')
    }

    if (regexUN.test(values[2]) && !usernameUsed()) {
        input_un.classList.remove('is-invalid')
        input_un.classList.add('is-valid')
    } else {
        input_un.classList.remove('is-valid')
        input_un.classList.add('is-invalid')
    }

    if (regexEM.test(values[3]) && !emailUsed()) {
        input_em.classList.remove('is-invalid')
        input_em.classList.add('is-valid')
    } else {
        input_em.classList.remove('is-valid')
        input_em.classList.add('is-invalid')
    }

    if (regexPW.test(values[4])) {
        input_pw.classList.remove('is-invalid')
        input_pw.classList.add('is-valid')
    } else {
        input_pw.classList.remove('is-valid')
        input_pw.classList.add('is-invalid')
    }
    if (values[4] == values[5] && values[5] != "") {
        input_pwc.classList.remove('is-invalid');
        input_pwc.classList.add('is-valid');
    } else {
        input_pwc.classList.remove('is-valid');
        input_pwc.classList.add('is-invalid');
    }

    return allGood(values)
}




/**
 * Permet de gérer le submit sur le formulaire
 * @param {*} e 
 */
async function gererSubmit(e) {
    e.preventDefault();
    try {
        const sign_first_name = input_fn.value.trim();
        const sign_last_name = input_ln.value.trim();
        const sign_username = input_un.value.trim();
        const sign_email = input_em.value.trim();
        const sign_password = input_pw.value.trim();
        const sign_password_confirm = input_pwc.value.trim();

        if (validationChamps([sign_first_name, sign_last_name, sign_username, sign_email, sign_password, sign_password_confirm])) {

            const request = await envoyerRequeteAjax(
                url = `/join/sign`,
                methode = "POST",
                {
                    first_name: sign_first_name,
                    last_name: sign_last_name,
                    username: sign_username,
                    email: sign_email,
                    password: sign_password,
                    password_confirm: sign_password_confirm
                }
            );

            window.location.href = request.url

        } else {
            console.log('Validation des champs incorrects');
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Initialisation de la page
 */
function initialisation() {
    resetValues()
    document.querySelector('form').addEventListener('submit', gererSubmit)
}
window.addEventListener('load', initialisation)