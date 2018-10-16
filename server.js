var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express()

var apiKey = '80c1245dc664673c681da5a0f58cf629';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')


var provinces = {};
app.get ('/', function (req,res){
 
  var url = 'https://apis.datos.gob.ar/georef/api/provincias';
  request(url, function(err,response, data){
    provinces = JSON.parse(data);
    res.render('index', {weather: null, error: null, provinces: provinces});
  })
})
app.post('/', function(req,res){
  var location =JSON.parse(req.body.location);
  var url ='http://api.openweathermap.org/data/2.5/weather?lat='+location.lat+'&lon='+location.lon+"&units=metric&appid="+apiKey;
  request(url, function (err, response, data){
    if(err){
      res.render('index', {weather: null, error: err, provinces: provinces});
    } else {
      var weather = JSON.parse(data)
      

      if(weather.cod !== 200){
        res.render('index', {weather: null, error: 'Error, please try again', provinces:provinces});
      } else {
        var temp = weather.main.temp;
        var name = weather.name;
        var text = 'la temperatura en: '+name+' es: '+ temp;
        res.render('index', {weather: text, error: null, provinces:provinces});
      }
    }
  })
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
/*app.post('/', function (req, res) {
  var city = req.body.city;
  var url = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=${apiKey}`
  request(url, function (err, response, data) {
    if(err){
      res.render('index', {weather: null, error: err});
    } else {
      //console.log(data)
      var weather = JSON.parse(data)

      if(weather.cod != 200){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        var w = weather.list[0];
        
        var weatherText = `It's ${w.main.temp} degrees in ${w.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})*/


