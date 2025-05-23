// #region Константы
const host = 'http://api-messenger.web-srv.local'
const context = select('.content')
// #endregion

// #region Переменные
let bearer_token = ''
let user_email = ''
let user_id = ''
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
    xhr.setRequestHeader( "Authorization", "Bearer " + bearer_token );
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
    xhr.setRequestHeader( "Authorization", "Bearer " + bearer_token );
    xhr.send(params.data)

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

function login (params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('POST',params.url)
    xhr.send(params.data)

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr)
        }
    }
}

function register(params, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', params.url)
    xhr.send(params.data)
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4) {
            callback(xhr)
        }
    }
}

function logout(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('DELETE',params.url)
    xhr.setRequestHeader( "Authorization", "Bearer " + bearer_token );
    xhr.send()

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

// #endregion

load('/modules/authorization.html', context, onLoadAuth)

// #region Авторизация
function onLoadAuth() {
    select('.go-register').addEventListener('click', function(){
        load('/modules/registration.html', context, onLoadReg)
    })
    select('.login').addEventListener('click', function () {
        let authData = new FormData()
        authData.append('email', select('input[name="email"]').value)
        authData.append('pass', select('input[name="pass"]').value)

        login({url: `${host}/auth/`, data: authData}, function(xhr){
            // console.log(xhr)

           if(xhr.status == 200) {
            responseText = JSON.parse(xhr.responseText)
            // console.log(responseText)
            user_id = responseText.Data.id
            user_email = responseText.Data.email
            bearer_token = responseText.Data.token
            // console.log(bearer_token);
            
            load('/modules/chats.html', context, onLoadChats)
           } else {
            select('.callback').innerHTML = xhr.statusText
           }
        })
    })
}
// #endregion

// #region Регистрация
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

            register({url: `${host}/user/`, data:regData}, function(xhr){
                console.log(xhr)

                if(xhr.status == 200){
                    let response = JSON.parse(xhr.responseText)
                    console.log(response)
                    bearer_token = response.Data.token
                    load('/modules/chats.html', context, onLoadChats)
                    
                }
                else{
                    select('.callback').innerHTML = xhr.statusText
                }
            })
    })
}
// #endregion

function onLoadChats() {
    // #region Получение чатов
    get({url: `${host}/chats/`}, function(response){
        response = JSON.parse(response)
        console.log(response)

        let chats = select('.chats-list')
        for(i=0; i<response.length; i++) {
            let element = response[i]
            let chat = document.createElement('div')
            chat.classList.add('chat-item')

            let chat_photo = document.createElement('div')
            chat_photo.classList.add('chat-photo')
            chat_photo.style.backgroundImage = element.companion_photo_link
            chat_photo.style.backgroundColor = 'none'
            chat.append(chat_photo)
            
            let chat_text = document.createElement('div')
            chat_text.classList.add('chat-text')
            chat.append(chat_text)

            let chat_name = document.createElement('div')
            chat_name.classList.add('chat-name')
            chat_name.textContent = element.companion_name + ' ' + element.companion_fam
            chat_text.append(chat_name)
            
            getMessages(element.chat_id)
            
            chats.append(chat)
            
        }
    })
    // #endregion

    // #region Кнопки меню
    select('.menu-btn').addEventListener('click', function(){
        let el = select('.menu')
        el.style.display = 'block'
    })
    select('.inmenu-btn').addEventListener('click', function(){
        let el = select('.menu')
        el.style.display = 'none'
    })
    select('.search-profile').addEventListener('click', function(){
        let el = select('.search-bar')
        el.style.display = el.style.display === 'flex' ? 'none' : 'flex'
    })
    select('.delete-profile').addEventListener('click', function(){
        let el = select('.delete-confirm')
        el.style.display = el.style.display === 'block' ? 'none' : 'block'
    })
    select('.confirm').addEventListener('click', function(){
        let xhr = new XMLHttpRequest()
        xhr.open('DELETE', `${host}/user/`)
        xhr.setRequestHeader( "Authorization", "Bearer " + bearer_token )
        xhr.send()

         xhr.onreadystatechange = function() {
            if(xhr.readyState==4){
                load('/modules/authorization.html', context, onLoadAuth)
        }
    }
    })
    select('.deny').addEventListener('click', function(){
        let el = select('.delete-confirm')
        el.style.display ='none' 
    })
    // #endregion

    select('.logout').addEventListener('click', function(){
        logout({url: `${host}/auth/`}, function(response){
            response = JSON.parse(response)
            console.log(response)
            bearer_token = ''

            load('/modules/authorization.html', context, onLoadAuth)
            select('.callback').innerHTML = 'Выход из приложения...'
        })
    })

    // #region Панель чатов
    select('.chat-placeholder').addEventListener('click', function(){
        let el1 = select('.text')
        let el2 = select('input[name="search"]')
        let el3 = select('.start-search')
        el1.style.display = el1.style.display = 'none' ? 'none' : 'none'
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
    // #endregion

    // #region Получение сообщений
    function getMessages(chat_id) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${host}/messages/?chat_id=${chat_id}`)
        xhr.setRequestHeader( "Authorization", "Bearer " + bearer_token )
        xhr.send()

        xhr.onreadystatechange = function(response){
            response = JSON.parse(response)
            console.log(response)

            let chat_window = select('.chat-window')
            for(i=0; i<response.length; i++) {
                let element = response[i]

                if(element.sender_id = user_id) {
                    let user_msg = document.createElement('div')
                    user_msg.classList.add('user-message')
                    user_msg.textContent = element.text
                    chat_window.append(user_msg)
                } else {
                    let companion_msg = document.createElement('div')
                    companion_msg.classList.add('companion-message')
                    companion_msg.textContent = element.text
                    chat_window.appemd(companion_msg)
                }
            }
        }
    }
    // #endregion
}