const alertMessage = require('./messenger'); //Bring in alert messegner

const ensureAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    alertMessage(res,'danger','Access Denied','fas fa-exclamation-circle', true);
    res.redirect('/');
}

module.exports = ensureAuthenticated;