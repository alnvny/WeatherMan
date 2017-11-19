#WeatherMan - API
###A backend service API in NodeJS that retrieves today forecast every 3 hours, for a particular city or location

###**Setup & Run Application**
    prerequisite - Make sure NodeJs is installed in your computer
1. Clone the application code in your local folder from the git repo link,  [https://github.com/alnvny/WeatherMan.git](https://github.com/alnvny/WeatherMan.git).
2. Open command prompt and select cloned folder location.
3. Execute "npm install" in command prompt, which will intall all the dependincies  
4. Execute "npm start" to run the application.

###**API Request**
The API request is a GET Request and you need to pass the locaction as a parameter in the API link.

    Request link: http://localhost:5000/getWeatherForecast/London
    (you can pass the location you request instead of London.)

Request Type : **GET**  
Application Path : **/getWeatherForecast/**  
Parameter : **location**

| Request Type |Element  | Description |Type |Required | Notes |
| --- | --- | --- | --- | --- |---|
| GET |location |location for which you need the weather forecast details| String | Yes||

###**API Response**
The Information responded by the API for a **valid** location are listed below:

| Element  | Description | Type | Notes |
| --- | --- | --- | --- |
|temperature |Top level | data Object||
|&nbsp; &nbsp; tempC |temperature in Celsius | String||
|&nbsp; &nbsp; tempF |temperature in Fahrenheit | String||
|wind |Top level | data Object||
|&nbsp; &nbsp; windspeedKmph |wind speed in Kmph | String||
|&nbsp; &nbsp; windspeedMiles |wind speed in Miles | String||
|precipitation | forcast of the precipitation | String||
|weatherIcons | icon /icons that matches the weather forcast | Array of weather icons Object||
|sunrise | sunrise time of the day  | String||
|sunset | sunset time of the day  | String||

The Information responded by the API for a **invalid** location are listed below:

| Element  | Description | Type | Notes |
| --- | --- | --- | --- |
|error | error message for invalid lovaction | Array of error message object||

###**Application Hoisted & Working API**
The application is also hoisted in Heroku(cloud platform as a service) through github.

    The live working application can be accessed in the below link, 
    https://weathermanforecast.herokuapp.com/getWeatherForecast/London

Host : **https://weathermanforecast.herokuapp.com**  
Method: **/getWeatherForecast/**  
Parameter: **Location**  
Parameter example: **Chennai**

###**Author Details**
Name : Gnana Allan Whinney GnanaPragasam





