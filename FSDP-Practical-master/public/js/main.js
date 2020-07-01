function languageCheck() {
  let checkBox = document.getElementsByName("language");
  let errorMsg = document.getElementById("languageErr");
  let submitButton = document.getElementById("butAddVideo");

  let checkStatus = 0;

  checkBox.forEach(function (item) {
    if (item.checked == true) {
      checkStatus += 1;
    }
  });

  if (checkStatus > 0) {
    errorMsg.style.display = "none";
    submitButton.disabled = false;
  } else {
    errorMsg.style.display = "block";
    submitButton.disabled = true;
  }
}

function getOMdbMovie() {
  const title = document.getElementById("title").value;
  const poster = document.getElementById("poster");
  const omdbErr = document.getElementById("OMdbErr");
  const posterURL = document.getElementById("posterURL");
  const starring = document.getElementById("starring");
  const story = document.getElementById("story");
  const datepicker = document.getElementById("datepicker");
  fetch("https://www.omdbapi.com/?t=" + title + "&apikey=60210937")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.Response === "False") {
        poster.src = "/img/no-image.jpg";
        omdbErr.style.display = "inline";
      } else {
        omdbErr.style.display = "none";
        poster.src = data.Poster;
        starring.value = data.Actors;
        posterURL.value = data.Poster; // hidden input field to submit
        story.value = data.Plot;
        datepicker.value = moment(new Date(data.Released)).format("DD/MM/YYYY");
      }
    })
    .catch((error) => {
      omdbErr.innerHTML = error;
    });
}

function toUpperCase() {
  let str = document.getElementById("title");
  str.value = str.value.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

$("#posterUpload").on("change", function () {
  let image = $("#posterUpload")[0].files[0];
  let formdata = new FormData();
  formdata.append("posterUpload", image);
  $.ajax({
    url: "/video/upload",
    type: "POST",
    data: formdata,
    contentType: false,
    processData: false,
    success: (data) => {
      $("#poster").attr("src", data.file);
      $("#posterURL").attr("value", data.file); // sets posterURL hidden field
      if (data.err) {
        $("#posterErr").show();
        $("#posterErr").text(data.err.message);
      } else {
        $("#posterErr").hide();
      }
    },
  });
});

