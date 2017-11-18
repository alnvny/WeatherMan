var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var cacheManager = {};

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

var weatherForecastPost = function(req, res, next) {

    var getLocation = req.body.location;
    var getCurrentDateTime = new Date();

    if (cacheManager && cacheManager[getLocation]) {
        var getThreeHoursaddedTime = cacheManager[getLocation].timestamp;
        getThreeHoursaddedTime = getThreeHoursaddedTime.addHours(3);
        if (getCurrentDateTime <= getThreeHoursaddedTime) {
            return res.send(cacheManager[getLocation].weatherDetails);
        }
    }

    var weatherForecastOptions = {
        url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=74d3c6ee3b234b5197e40418171811&q=' + req.body.location + '&format=json&num_of_days=1&tp=24',
        headers: { 'Content-Type': 'application/json' }
    };
    request.get(weatherForecastOptions, function(error, response, body) {
        var bodyData = body ? JSON.parse(body) : {};
        if (response.statusCode === 200 && bodyData.data && !bodyData.data.error) {
            cacheManager[getLocation] = {}
            cacheManager[getLocation].timestamp = getCurrentDateTime;
            cacheManager[getLocation].weatherDetails = createWeatherForecastResponse(bodyData.data.weather[0]);
            res.send(cacheManager[getLocation].weatherDetails);
        } else {
            res.send(bodyData.data);
        }
    });
}

function createWeatherForecastResponse(currentWeatherDetails){
  var weatherUpdates = {};
  weatherUpdates.temperature = {};
  weatherUpdates.temperature.tempC = currentWeatherDetails.hourly[0].tempC;
  weatherUpdates.temperature.tempF = currentWeatherDetails.hourly[0].tempF;
  weatherUpdates.wind = {};
  weatherUpdates.wind.windspeedKmph = currentWeatherDetails.hourly[0].windspeedKmph;
  weatherUpdates.wind.windspeedMiles = currentWeatherDetails.hourly[0].windspeedMiles;
  weatherUpdates.precipitation = currentWeatherDetails.hourly[0].precipMM;
  weatherUpdates.weatherIcons = currentWeatherDetails.hourly[0].weatherIconUrl;
  weatherUpdates.sunrise = currentWeatherDetails.astronomy[0].sunrise;
  weatherUpdates.sunset = currentWeatherDetails.astronomy[0].sunset;
  return weatherUpdates;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getWeatherForecast', weatherForecastPost);

app.listen(process.env.PORT || 5000, function() {
    console.log('app is running at :' + process.env.PORT);
});
