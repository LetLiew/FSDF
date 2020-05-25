const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');

// Adds new video jot from /video/addVideo
router.post('/showAddVideo',ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;

    // Multi-value components return array of strings or undefined
    Video.create({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
        userId
    }).then((video) => {
        res.redirect('/video/listVideos');
    })
        .catch(err => console.log(err))
});

// List videos belonging to current logged in user
router.get('/listVideos',ensureAuthenticated, (req, res) => {

    Video.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['title', 'ASC']
        ],
        raw: true
    })
        .then((videos) => {
            // pass object to listVideos.handlebar
            res.render('video/listVideos', {
                videos: videos
            });
        })
        .catch(err => console.log(err));
});

router.get('/showAddVideo',ensureAuthenticated, (req, res) => {

    res.render('video/addVideo');
});

// Shows edit video page
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    Video.findOne({
        where: {
            id: req.params.id
        }
    }).then((video) => {
        checkOptions(video);
        if (req.user.id === video.userId){
        res.render('video/editVideo', {         // call views/video/editVideo.handlebar to render the edit video page
            video // passes video object to handlebar
        });}
    }).catch(err => console.log(err)); // To catch no video ID
});



// Creates variables with ‘check’ to put a tick in the appropriate checkbox
function checkOptions(video) {
    video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
    video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
    video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
    video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';

    //subtitles
    video.chineseSub = (video.subtitles.search('Chinese') >= 0) ? 'checked' : '';
    video.englishSub = (video.subtitles.search('English') >= 0) ? 'checked' : '';
    video.malaySub = (video.subtitles.search('Malay') >= 0) ? 'checked' : '';
    video.tamileSub = (video.subtitles.search('Tamil') >= 0) ? 'checked' : '';
}

//save Edited Video
router.put('/saveEditedVideo/:id',ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, "DD/MM/YYYY");
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' :
        req.body.subtitles.toString();

    let classification = req.body.classification;

    Video.update({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
    }, {
        where: {
            id: req.params.id
        }
    }).then((video) => {
        res.redirect('/video/listVideos');
    }).catch(err => console.log(err));
});

router.get('/delete/:id',ensureAuthenticated, (req,res) =>{
    let videoId = req.params.id;
    let userId = req.user.id;

    Video.findOne({
        where:{
            id:videoId,
            userID: userId,
        }
    }).then((video)=>{
        if(video == null){
            res.redirect('/logout');
        }
        else{
            Video.destroy({
                where: {
                id: videoId
                }
                }).then((video) =>{
                    res.redirect('/video/listVideos');
                })
        };
    }).catch(err => console.log(err));
});


module.exports = router;