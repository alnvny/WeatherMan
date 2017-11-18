var express = require('express');
var app = express();

app.post('/getWeatherForecast', weatherForecastPost);

var weatherForecastPost = function(req, res, next) {

}
