const express = require("express");
const router = express.Router();
const moment = require("moment");
const Video = require("../models/Video");
const ensureAuthenticated = require("../helpers/auth");
const alertMessage = require("../helpers/messenger");

// Required for file upload
const fs = require("fs");
const upload = require("../helpers/imageUpload");

// Adds new video jot from /video/addVideo
router.post("/addVideoJot", ensureAuthenticated, (req, res) => {
  let title = req.body.title;
  let story = req.body.story.slice(0, 1999);
  let dateRelease = moment(req.body.dateRelease, "DD/MM/YYYY");
  let language = req.body.language.toString();
  let subtitles =
    req.body.subtitles === undefined ? "" : req.body.subtitles.toString();
  let classification = req.body.classification;
  let userId = req.user.id;
  let starring = req.body.starring;
  let posterURL = req.body.posterURL;

  // Multi-value components return array of strings or undefined
  Video.create({
    title,
    story,
    classification,
    language,
    subtitles,
    dateRelease,
    userId,
    starring,
    posterURL,
  })
    .then((video) => {
      res.redirect("/video/listVideos");
    })
    .catch((err) => console.log(err));
});

// List videos belonging to current logged in user
router.get("/listVideos", ensureAuthenticated, (req, res) => {
  Video.findAll({
    where: {
      userId: req.user.id,
    },
    order: [["title", "ASC"]],
    raw: true,
  })
    .then((videos) => {
      // pass object to listVideos.handlebar
      res.render("video/listVideos", {
        videos: videos,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/showAddVideo", ensureAuthenticated, (req, res) => {
  res.render("video/addVideo");
});

// Shows edit video page
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Video.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((video) => {
      checkOptions(video);
      if (req.user.id === video.userId) {
        res.render("video/editVideo", {
          // call views/video/editVideo.handlebar to render the edit video page
          video, // passes video object to handlebar
        });
      }
    })
    .catch((err) => console.log(err)); // To catch no video ID
});

// Creates variables with ‘check’ to put a tick in the appropriate checkbox
function checkOptions(video) {
  video.chineseLang = video.language.search("Chinese") >= 0 ? "checked" : "";
  video.englishLang = video.language.search("English") >= 0 ? "checked" : "";
  video.malayLang = video.language.search("Malay") >= 0 ? "checked" : "";
  video.tamilLang = video.language.search("Tamil") >= 0 ? "checked" : "";

  //subtitles
  video.chineseSub = video.subtitles.search("Chinese") >= 0 ? "checked" : "";
  video.englishSub = video.subtitles.search("English") >= 0 ? "checked" : "";
  video.malaySub = video.subtitles.search("Malay") >= 0 ? "checked" : "";
  video.tamileSub = video.subtitles.search("Tamil") >= 0 ? "checked" : "";
}

//save Edited Video
router.put("/edit/saveEditedVideo/:id", ensureAuthenticated, (req, res) => {
  let title = req.body.title;
  let story = req.body.story.slice(0, 1999);
  let dateRelease = moment(req.body.dateRelease, "DD/MM/YYYY");
  let language = req.body.language.toString();
  let subtitles =
    req.body.subtitles === undefined ? "" : req.body.subtitles.toString();

  let classification = req.body.classification;
  let starring = req.body.starring;
  let posterURL = req.body.posterURL;

  console.log(posterURL);

  Video.update(
    {
      title,
      story,
      classification,
      language,
      subtitles,
      dateRelease,
      starring,
      posterURL,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((video) => {
      res.redirect("/video/listVideos");
    })
    .catch((err) => console.log(err));
});

router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  let videoId = req.params.id;
  let userId = req.user.id;

  Video.findOne({
    where: {
      id: videoId,
      userID: userId,
    },
  })
    .then((video) => {
      let title = video.title;

      if (video == null) {
        res.redirect("/logout");
      } else {
        Video.destroy({
          where: {
            id: videoId,
          },
        }).then((video) => {
          alertMessage(
            res,
            "success",
            "Video " + title + " is successfully deleted",
            "fas fa-sign-in-alt",
            true
          );
          res.redirect("/video/listVideos");
        });
      }
    })
    .catch((err) => console.log(err));
});

// Upload poster
router.post("/upload", ensureAuthenticated, (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync("./public/uploads/" + req.user.id)) {
    fs.mkdirSync("./public/uploads/" + req.user.id);
  }

  upload(req, res, (err) => {
    if (err) {
      res.json({ file: "/img/no-image.jpg", err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: "/img/no-image.jpg", err: err });
      } else {
        res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
      }
    }
  });
});

module.exports = router;
