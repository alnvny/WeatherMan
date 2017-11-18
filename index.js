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
    } else {
        cacheManager[getLocation] = {}
        cacheManager[getLocation].timestamp = new Date();
    }
    var weatherForecastOptions = {
        url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=74d3c6ee3b234b5197e40418171811&q=' + req.body.location + '&format=json&num_of_days=1&tp=24',
        headers: { 'Content-Type': 'application/json' }
    };
    request.get(weatherForecastOptions, function(error, response, body) {
        var bodyData = body ? JSON.parse(body) : {};
        if (!error && response.statusCode === 200) {
            var weatherUpdates = {};
            var currentWeather = bodyData.data.weather[0];
            weatherUpdates.temperature = {};
            weatherUpdates.temperature.tempC = currentWeather.hourly[0].tempC;
            weatherUpdates.temperature.tempF = currentWeather.hourly[0].tempF;
            weatherUpdates.wind = {};
            weatherUpdates.wind.windspeedKmph = currentWeather.hourly[0].windspeedKmph;
            weatherUpdates.wind.windspeedMiles = currentWeather.hourly[0].windspeedMiles;
            weatherUpdates.precipitation = currentWeather.hourly[0].precipMM;
            weatherUpdates.weatherIcons = currentWeather.hourly[0].weatherIconUrl;
            weatherUpdates.sunrise = currentWeather.astronomy[0].sunrise;
            weatherUpdates.sunset = currentWeather.astronomy[0].sunset;
            cacheManager[getLocation].weatherDetails = weatherUpdates;
            res.send(cacheManager[getLocation].weatherDetails);
        } else {
            console.log(bodyData.log_message);
            res.send({ 'success': false, 'message': bodyData.log_message });
        }
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getWeatherForecast', weatherForecastPost);

app.listen(process.env.PORT || 5000, function() {
    console.log('app is running at :' + process.env.PORT);
});
