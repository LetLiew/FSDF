function languageCheck(){
    let checkBox = document.getElementsByName('language');
    let errorMsg = document.getElementById('languageErr');
    let submitButton = document.getElementById('butAddVideo');
    
    let checkStatus = 0;

    checkBox.forEach(function(item){
        if (item.checked == true){
            checkStatus += 1
        }
    });
        

    if (checkStatus > 0){
        errorMsg.style.display = 'none';
        submitButton.disabled = false;
    }
    else{
        errorMsg.style.display = 'block';
        submitButton.disabled = true;
    }
};

