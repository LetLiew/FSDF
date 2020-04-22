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

//about
router.get('/about', (req,res) => {
	const author = 'Hieu Nguyen';
	res.render('about',{
		author:author
	})
})

module.exports = router;
