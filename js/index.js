var environment = require('./environment')
var apod = require('nasa-apod')
var $ = require('jquery')

var randomDate = function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var date = randomDate(new Date(2012, 0, 1), new Date())

apod(date).then(function(data) {
    $('#body').css("background-image","url("+data.hdurl+")")
    $('#body').css("background-position","center")
    $('#body').css("background-size","cover")
    $('#body').css("background-repeat","no-repeat")
    console.log(data.url)
})


environment.init()
environment.startAnimation()
