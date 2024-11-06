//j-query
$(document).ready(function() { // it make sures that all html elements fully loaded  and ready to be accessed before executing any JavaScript code
    // API key for OpenWeatherAPI
    const API_KEY = "651af124a578161f891756fd4d7d40c6";
    let message;
    // Form submit event listener
    $("#task-form").submit(function(e) {
      e.preventDefault(); //the form will not be submitted and the page will not reload when the submit button is clicked
  
      // Get form input values
      let task = $("#task-input").val();
      let category = $("#task-category").val();
      let city = $("#city-input").val();
  
      // Clear form inputs
      $("#task-input").val("");
      $("#city-input").val("");

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


      // Get weather data from OpenWeatherAPI
$.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`,
    method: "GET"
  }).done(function(response) {
    document.querySelector(".message").innerText="";
    // Get current temperature and precipitation information
    let info=weather(response);
    console.log("info ",info);
    let temperature = info['t1'].main.temp;
    console.log("temperature==",temperature);
    let precipitation = info['t1'].weather[0].main;
  
    // Determine task suitability based on weather conditions
    let weatherSuitable;
    message="";
    if (category === "indoor") {
      weatherSuitable = true;
    } else if (category === "outdoor") {
      if (temperature > 8 && temperature < 37 && precipitation !== "Rain") {
        weatherSuitable = true;
      } else {
        weatherSuitable = false;
        if (temperature <= 273 && precipitation !== "Rain") {
            message = `Too Cold (${temperature})`;
          } else if (temperature >= 293) {
            message = `Too Hot (${temperature})`;
          } else if (precipitation === "Rain") {
            message = "Rainy";
          }
      }
    }
  
    // Add task to task list
    let taskElement = $("<li>").text(task);
    if (weatherSuitable) {
      taskElement.addClass("green");
    } else {
      taskElement.addClass("red");
      let messageElement = $("<span>").text(` (${message})`).addClass("message");
      taskElement.append(messageElement);
    }
    $("#task-list").append(taskElement);
  }).fail(function(error) {
    if(error.responseJSON.cod="404")
    {
      document.querySelector(".message").innerText="Invalid city name";
    }
    else{
    document.querySelector(".message").innerText="Failed to retrieve weather data";
    console.error("Failed to retrieve weather data", error);
    }
  });
});
});    