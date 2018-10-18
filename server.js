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
  var lat = req.body.lat;
  var lng = req.body.lng;
  var url ='http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+"&units=metric&appid="+apiKey;
  request(url, function (err, response, data){
    if(err){
      res.render('index', {weather: null, error: err, provinces: provinces});
    } else {
      var weather = JSON.parse(data)
      

      if(weather.cod !== 200){
        res.render('index', {weather: null, error: 'Error, please try again', provinces:provinces});
      } else {
        res.json(weather)
      }
    }
  })
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



