const express = require('express');
const router = express.Router();
// User register URL using HTTP post => /user/register

router.post('/register', (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password1 = req.body.password;
    let password2 = req.body.password2;
    let errors = [];
    let success_msg = `${email} is succesfully registered`;

    if (password1 == password2 && password1.length >= 4) {
        res.render('user/login', { success_msg: success_msg })
    }
    else {
        if (password1 !== password2) {
            errors.push({ text: 'Passwords must match.' })
        };
        if (password1.length < 4) {
            errors.push({ text: 'Password must be more than 4 characters.' })
        };
        res.render('user/register', { errors: errors, name: name, email: email });
        errors = []
    };


});

module.exports = router;