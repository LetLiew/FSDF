const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');

const User = require('../models/User');
const alertMessage = require('../helpers/messenger');

const passport = require('passport');
// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/video/listVideos', // Route to /video/listVideos URL
        failureRedirect: '/user/login', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
       message given by the strategy's verify callback, if any. When a failure occur passport passes the message
       object as error */
    })(req, res, next);

});


router.get('/login', (req, res) => {

	res.render('user/login'); 
});



router.get('/register', (req, res) => {

	res.render('user/register'); 
});

// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    /*
    let errors = []
    let success_msg = 'test';
    // Do exercise 3 here

    if (!(req.body.password.length >= 4)){
        errors.push("Password must have at least 4 characters.")
    }
    if(!(req.body.password == req.body.password2)){
        errors.push("Passwords must be the same.")
    }
    if(errors.length == 0){
        console.log('PASSWORD NONE')
        success_msg = `${req.body.email} registered successfully for ${req.body.name}`;
        //success_msg = "YES";
        res.render('user/login', {success_msg:success_msg, name:req.body.name, email: req.body.email , password:req.body.password, password2:req.body.password2}); 
    }
    else{
        res.render('user/register', {errors:errors, error_msg:"HOHOHO",name:req.body.name, email: req.body.email , password:req.body.password, password2:req.body.password2})
    }*/

    let errors = [];

    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } 
    else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    
                    // Create new user record
                    bcrypt.genSalt(10, function(err, salt) {
                        if (err) return next(err);
                        bcrypt.hash(password, salt, function(err, hash) {
                            if (err) return next(err);
                            
                            password = hash;
                            
                            User.create({ name, email, password })
                                .then(user => {
                                    console.log("TESTING")
                                    console.log(user.password)
                                    alertMessage(res, 'success', user.name + ' added.Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/user/login');
                                })
                                .catch(err => console.log(err));
                            
                        });
                    });

                    
                }
            });
    }
});


module.exports = router;
