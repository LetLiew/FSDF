const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {title: title}) // renders views/index.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// showLogin
router.get('/showLogin', (req, res) => {
	res.render('user/login')
});

//showRegister
router.get('/showRegister', (req, res) =>{
	res.render('user/register')
});

//error msg + about
router.get('/about', (req, res) => {
	const author = 'Hieu Nguyen';
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	var errors = [{text: 'First error message'},{text: 'Second error message'},{text: 'Third error message'}]

	res.render('about', {
	author: author, success_msg: success_msg, error_msg: error_msg, errors : errors,
	}) 
});

module.exports = router;
