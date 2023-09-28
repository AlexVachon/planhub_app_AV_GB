/**
 * Permet de se créer un compte
 */

const regexPW = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{3,20}$/


console.log(regexPW.test("Alex2000!"))