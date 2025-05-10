// #region Константы
const host = 'ksdlakdlsa'
const context = select('.content')
// #endregion

// #region Переменные
let token = ''
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
// #endregion

load('/modules/chats.html', context, onLoadChats)

function onLoadAuth() {
    select('.go-register').addEventListener('click', function(){
        load('/modules/registration.html', context, onLoadReg)
    })
    select('.login').addEventListener('click', function () {
        load('/modules/chats.html', context, onLoadChats)
        select('.callback').innerHTML = ''
    })
}

function onLoadReg(){
    select('.go-auth').addEventListener('click', function(){
        load('/modules/authorization.html', context, onLoadAuth)
    })
        select('.login').addEventListener('click', function () {
        load('/modules/chats.html', context, onLoadChats)
    })
}

function onLoadChats() {
    select('.logout').addEventListener('click', function(){
        load('/modules/authorization.html', context, onLoadAuth)
        select('.callback').innerHTML = 'Выход из приложения...'
    })
}