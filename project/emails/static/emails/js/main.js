
const pollInterval = 2000;

let TASK_ID = null,
    requestInterval = null;

/* HELPERS */

function capitalizeFirst(str){
    if(str){
        let first = str[0].toUpperCase();
        str = str.toLowerCase();
        return first + str.substring(1);
    }

    return;
}

function getFormData(){
    const email = document.querySelector(".form .email").value,
        number = document.querySelector(".form .number").value;
    
    return {
        email,
        number
    }
}
const buildRequest = (method) => {

    const options = {
        method: method,
    }
    
    if(method === "POST"){
        // Request for send emails
        const headers = new Headers(),
            csrf = document.querySelector(
                '.form input[name="csrfmiddlewaretoken"]'
            ).value;

        headers.set("Content-Type", "application/json");
        headers.set("X-CSRFToken", csrf);
        headers.set("Access-Control-Allow-Origin", "same-origin");

        options.headers = headers;
        options.body = JSON.stringify(getFormData())
    }

    return options;
}

function makeRequest(url, method, success){

    fetch(url, buildRequest(method))
    .then(response => { 
        if (response.ok) return response.json() 
    })
    .then(object => {success(object) })
    .catch(error => console.error(error));
}

function enableForm(enable){
    const email = document.querySelector(".form .email"),
        number = document.querySelector(".form .number"), 
        btnSend = document.querySelector(".form button");

    if(enable){
        email.removeAttribute("readonly", true);
        email.classList.remove("input-disabled");
        number.removeAttribute("readonly", true);
        number.classList.remove("input-disabled");
        btnSend.removeAttribute("disabled");
        btnSend.classList.remove("btn-disabled");
    }else{
        email.setAttribute("readonly", true);
        email.classList.add("input-disabled");
        number.setAttribute("readonly", true);
        number.classList.add("input-disabled");
        btnSend.setAttribute("disabled", true);
        btnSend.classList.add("btn-disabled");
    }
}

function showStatus(show){
    const status = document.querySelector(".status");

    (show)
        ? status.classList.remove("d-none")
        : status.classList.add("d-none");
}

function showLoaderCompleted(show, success){
    const imgLoader = document.querySelector(
        ".loader .loader-img"
    ),
    loaderCompleted =  document.querySelector(
        ".loader .loader-completed"
    );
    
    if(show){
        imgLoader.classList.add("d-none");
        loaderCompleted.classList.remove("d-none");

        if(success){
            loaderCompleted.classList.add("success")
            loaderCompleted.classList.remove("failure");
        }else{
            loaderCompleted.classList.remove("success")
            loaderCompleted.classList.add("failure");
        }        
    }else{
        imgLoader.classList.remove("d-none");
        loaderCompleted.classList.add("d-none");
        loaderCompleted.classList.remove("failure", "success");
    }
}

function resetStatus(){
    const percent = document.querySelector(".loader-percent");

    percent.textContent = "0%";
    percent.classList.remove("success", "loader-percent-completed");

    showStatus(true);
    showLoaderCompleted(false, null);
}

/* SEND EMAILS */
function successSend(obj){

    TASK_ID = obj.task.id;
    requestInterval = setInterval(getResult, pollInterval);

    showStatus(true);
    enableForm(false);
}

function sendEmails(){
   const url = document.querySelector(
       "#ref .url-send"
       ).value;

    makeRequest(url, "POST", successSend);

    resetStatus();
}

/* GET RESULTS */
function successResult(obj){
    const messageStatus = document.querySelector(".status .message p"),
        percent = document.querySelector(".loader .loader-percent"),
        status = capitalizeFirst(obj.state);

    messageStatus.textContent = `${status}...`;
    percent.textContent = `${obj.progress.percent}%`;


    if(obj.complete){
        clearInterval(requestInterval);
        enableForm(true);
        percent.classList.add("loader-percent-completed");

        if(obj.success){
            showLoaderCompleted(true, true);
            percent.classList.add("success");
        }else{
            percent.textContent = `X`;
            percent.classList.add("failure");
            showLoaderCompleted(true, false);
        }
    }
}

function getResult(){
    const url = document.querySelector(
        "#ref .url-progress"
        ).value;

    makeRequest(`${url}${TASK_ID}/`, "GET", successResult);
}

document.addEventListener("DOMContentLoaded", e => {

    const form = document.querySelector(".form");

    form.addEventListener("submit", e => {
        sendEmails();
        e.preventDefault();
    })
})