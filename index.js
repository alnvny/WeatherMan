var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/getWeatherForecast', weatherForecastPost);



var cache =[];

function weatherForecastPost(req, res, next) {
  console.log(JSON.stringify(req.body));
  var weatherForecastOptions = {
      url:  'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=74d3c6ee3b234b5197e40418171811&q='+req.body.location+'&format=json&num_of_days=1&tp=24',
      headers: { 'Content-Type': 'application/json' }
  };
  request.get(weatherForecastOptions, function(error, response, body) {
    var bodyData = body ? JSON.parse(body) : {};
    console.log(bodyData);
    if (!error && response.statusCode === 200) {
           res.send({ 'success': true });
    }else {
            console.log(bodyData.log_message);
            res.send({ 'success': false, 'message': bodyData.log_message });
        }
  });
}

app.listen(process.env.PORT || 5000, function() {
    console.log('Node app is running at :' + process.env.PORT);
});
