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

function get(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('GET',params.url)
    xhr.send()

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
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
                bearer_token = response.Data.token
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
                    bearer_token = response.Data.token
                    
                }
                else{
                    select('.callback').innerHTML = response.message
                }
            })
    })
}

function onLoadChats() {
    get({url: `${host}/chats/`}, function(response){
        response = JSON.parse(response)
        console.log(response)

        let chats = select('.chats-list')
        for(i=0; i<response.length; i++) {
            let chat = document.createElement('.chat-item')

            chats.append(chat)
        }
    })
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
        let el3 = select('.start-search')
        el1.style.display = el1.style.display === 'none' ? 'none' : 'none'
        el2.style.display = el2.style.display === 'block' ? 'block' : 'block'
        el3.style.display = el3.style.display === 'block' ? 'block' : 'block'
    })
    select('.chat-item').addEventListener('click', function(){
        let el1 = select('.placeholder-text')
        let el2 = select('.message-area')
        let el3 = select('.new-message-mark')
        let el4 = select('.user-message')
        let el5 = select('.companion-message')
        el1.style.display = el1.style.display === 'none' ? 'block' : 'none'
        el2.style.display = el2.style.display === 'flex' ? 'none' : 'flex'
        el3.style.display = 'none'
        el4.style.display = el4.style.display === 'block' ? 'none' : 'block'
        el5.style.display = el5.style.display === 'block' ? 'none' : 'block'
    })
    select('.start-search').addEventListener('click', function(){
        let search_user = new FormData
        search_user.append('email', select('input[name="search"]').value)

        post({url: `${host}/chats/`, data: search_user}, function(response){
            response = JSON.parse(response)
            console.log(response)
        })
    })
}