// getting References of html Elements

const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location");
const weatherData = document.getElementById("weather-data");
const message = document.getElementById("message");
const message1 = document.getElementById("message1");
const currentWeatherData = document.getElementById("current-weather-data");
const predictionForm = document.getElementById("prediction-form");
const predictionInput = document.getElementById("prediction");

function weather(data){
  //Get the today's weather 
  let t1 = new Date();
    let todayWeather = data.list.find(weather => {
      let weatherDate = new Date(weather.dt * 1000);
      return weatherDate.toDateString() === t1.toDateString();
    });
    
    // Get the tomorrow's weather
    let t2 = new Date(t1);
    t2.setDate(t2.getDate() + 1);
    let tomorrowWeather = data.list.find(weather => {
      let weatherDate = new Date(weather.dt * 1000);
      return weatherDate.toDateString() === t2.toDateString();
    });

    // Get the day after tomorrow's weather
    let t3= new Date(t2);
    t3.setDate(t3.getDate() + 1);
    let dayAfterTomorrowWeather = data.list.find(weather => {
      let weatherDate = new Date(weather.dt * 1000);
      return weatherDate.toDateString() === t3.toDateString();
    });

    return {
      t1: todayWeather,
      t2: tomorrowWeather,
      t3: dayAfterTomorrowWeather
    };

}
weatherData.style.display = "none"; // making display none until location entered

locationForm.addEventListener("submit", (event) => { //submit button of location form
  event.preventDefault();
  let location = locationInput.value;
  message.textContent = "Loading weather data...";
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=651af124a578161f891756fd4d7d40c6`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      let info = weather(data)
      console.log("info ",info);
      console.log("form: ",data);
      message.textContent = "";
      currentWeatherData.textContent = `The current weather in ${data.city.name} is ${info['t1'].weather[0].main}.`;
      weatherData.style.display = "block";
      getPredictionData(info['t2'].weather[0].main);
    })
    .catch((error) => {
      message.textContent = "There was an error getting the weather data. Please try again."; //error if weather data not fetched
    });
    predictionInput.value = ""; //for every time entering city making previous values delete
    message1.textContent="";
});

const getPredictionData = (actualWeather) => {
  predictionForm.addEventListener("submit", (event) => {
    event.preventDefault(); // the form will not be submitted and the page will not reload when the submit button is clicked
    const prediction = predictionInput.value;
    message1.textContent = "Checking prediction...";
    weatherData.style.display = "none";
        message.textContent = "";

        //prediction comparing
        if (prediction === "sunny" && (actualWeather === "Clear" || actualWeather === "Sunny")) {
          message1.textContent = "Congratulations! Your prediction was correct.";
        } else if (prediction === "rainy" && (actualWeather === "Rain" || actualWeather === "Drizzle" || actualWeather === "Shower Rain")) {
          message1.textContent = "Congratulations! Your prediction was correct.";
        } else if (prediction === "cloudy" && (actualWeather === "Clouds" || actualWeather === "Overcast" )) {
          message1.textContent = "Congratulations! Your prediction was correct.";
        } else if (prediction === "snowy" && actualWeather === "Snow") {
          message1.textContent = "Congratulations! Your prediction was correct.";
        } 
        else if (prediction === "haze" && actualWeather === "Haze") {
          message1.textContent = "Congratulations! Your prediction was correct.";
        } // add additional checks for other weather descriptions as needed
        else {
          message1.textContent = `Sorry, your prediction was incorrect. The actual tomorrow's weather was ${actualWeather}.`;
        }
        
        weatherData.style.display = "block";
      })
    }

