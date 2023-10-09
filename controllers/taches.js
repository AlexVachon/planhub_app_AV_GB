const path = require('path')

const loadPage = (req, res) =>{
    if (req.session.authenticated){
        res.status(200).render(path.join(__dirname, '../public/templates/tache'))
    }else{
        res.status(401).redirect('/join')
    }

}

module.exports = {
    loadPage,
}