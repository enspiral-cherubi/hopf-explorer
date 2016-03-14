var environment = require('./environment')
var apod = require('nasa-apod')
var $ = require('jquery')

apod().then(function(data) {
    $('#body').css("background-image","url("+data.url+")")
    $('#body').css("background-position","center")
    $('#body').css("background-size","150%")
    $('#body').css("background-repeat","no-repeat")
    console.log(data.url)
})


environment.init()
environment.startAnimation()
