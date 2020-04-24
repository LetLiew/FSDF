const alertMessage = require('../helpers/messenger');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', { title: title }) // renders views/index.handlebars
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
router.get('/showRegister', (req, res) => {
	res.render('user/register')
});

//error msg + about
router.get('/about', (req, res) => {
	const author = 'Hieu Nguyen';
	
	alertMessage(res, 'success', // is not rendering
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	let error = {
		text: "Error message using error object"
	}
	var errors = [{ text: 'First error message' }, { text: 'Second error message' }, { text: 'Third error message' }]

	res.render('about', {
		author: author, success_msg: success_msg, error_msg: error_msg, errors: errors, error: error
	})
});

module.exports = router;
