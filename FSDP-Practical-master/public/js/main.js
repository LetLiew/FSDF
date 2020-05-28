function languageCheck() {
    let checkBox = document.getElementsByName('language');
    let errorMsg = document.getElementById('languageErr');
    let submitButton = document.getElementById('butAddVideo');

    let checkStatus = 0;

    checkBox.forEach(function (item) {
        if (item.checked == true) {
            checkStatus += 1
        }
    });


    if (checkStatus > 0) {
        errorMsg.style.display = 'none';
        submitButton.disabled = false;
    }
    else {
        errorMsg.style.display = 'block';
        submitButton.disabled = true;
    }
};

function getOMdbMovie() {
    const title = document.getElementById('title').value;
    const poster = document.getElementById('poster');
    const omdbErr = document.getElementById('OMdbErr');
    const posterURL = document.getElementById('posterURL');
    const starring = document.getElementById('starring');
    const story = document.getElementById('story');
    const datepicker = document.getElementById('datepicker');
    fetch('https://www.omdbapi.com/?t=' + title + '&apikey=60210937')
        .then((res) => {
            return res.json();
        }).then((data) => {
            if (data.Response === 'False') {
                poster.src = '/img/no-image.jpg';
                omdbErr.style.display = 'inline';
            } else {
                omdbErr.style.display = 'none';
                poster.src = data.Poster;
                starring.value = data.Actors;
                posterURL.value = data.Poster; // hidden input field to submit
                story.value = data.Plot;
                datepicker.value = moment(new
                    Date(data.Released)).format('DD/MM/YYYY');
            }
        }).catch(error => { omdbErr.innerHTML = error; })

}

