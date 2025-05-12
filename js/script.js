// #region Константы
const host = 'http://api-messenger.web-srv.local'
const context = select('.content')
// #endregion

// #region Переменные
let bearer_token = ''
let user_email = ''
// #endregion

// #region Функции-комбайны
function select (selector) {
    return document.querySelector(selector)
}

function load (url, c, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('GET', url)
    xhr.send()
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){http://127.0.0.1:3000/i.html
            c.innerHTML = xhr.responseText;
            if (callback){
                callback()
            }
        }
    }
}

function post(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('POST',params.url)
    xhr.send(params.data)

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

function logout(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('DELETE',params.url)
    xhr.send()

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

// #endregion

load('/modules/chats.html', context, onLoadChats)

function onLoadAuth() {
    select('.go-register').addEventListener('click', function(){
        load('/modules/registration.html', context, onLoadReg)
    })
    select('.login').addEventListener('click', function () {
        let authData = new FormData()
        authData.append('email', select('input[name="email"]').value)
        authData.append('pass', select('input[name="pass"]').value)

        post({url: `${host}/auth/`, data: authData}, function(response){
            response = JSON.parse(response)
            console.log(response)

            if (response.message == "Доступ разрешен") {
                bearer_token = response.token
                load('/modules/chats.html', context, onLoadChats)
            }
        })
    })
}

function onLoadReg(){
    select('.go-auth').addEventListener('click', function(){
        load('/modules/authorization.html', context, onLoadAuth)
    })
        select('.register').addEventListener('click', function () {
            let regData = new FormData();
            regData.append('email', select('input[name="email"]').value)
            regData.append('pass', select('input[name="pass"]').value)
            regData.append('fam', select('input[name="last-name"]').value)
            regData.append('name', select('input[name="first-name"]').value)
            regData.append('otch', select('input[name="fam-name"]').value)

            post({url: `${host}/user/`, data:regData}, function(response){
                response = JSON.parse(response)
                console.log(response)

                if(response.message == "Регистрация успешна"){
                    bearer_token = response.token
                    
                }
                else{
                    select('.callback').innerHTML = response.message
                }
            })
    })
}

function onLoadChats() {
    select('.logout').addEventListener('click', function(){
        logout({url: `${host}/auth/`}, function(response){
            response = JSON.parse(response)
            console.log(response)
            bearer_token = ''

            load('/modules/authorization.html', context, onLoadAuth)
            select('.callback').innerHTML = 'Выход из приложения...'
        })
    })
    select('.chat-placeholder').addEventListener('click', function(){
        let el1 = select('.text')
        let el2 = select('input[name="search"]')
        el1.style.display = el1.style.display === 'block' ? 'none' : 'block'
        el2.style.display = el2.style.display === 'none' ? 'block' : 'none'
    })
    select('.chat-item').addEventListener('click')
}