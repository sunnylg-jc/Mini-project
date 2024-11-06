
//Getting all the elements through class names
const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    arrowBack = wrapper.querySelector("header i");


let api;   //api variable to store the url of to make request to api regarding weather details

//event lisenter for the inputfield
inputField.addEventListener("keyup", e => {  //The keyup event is fired when a user releases a key on the keyboard. 

    // if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value); // calling requestApi() function by passing city name  as argument
    }
});



//event Lisenter for the enter button
locationBtn.addEventListener("click", () => {
    requestApi(inputField.value);

});



//taking city name as argument and fetching data from weather api
function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=651af124a578161f891756fd4d7d40c6`;
   return fetchData();
}

//fetching data from weather api
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    return fetch(api).then(res => res.json())  // getting api response and returning it with parsing into js obj and in another 

        .then(result => weatherDetails(result))   // then function calling weatherDetails function with passing api result as an argument

        .catch(() => {                   // if any error during fetching
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}


// getting weather data of today , tomorrow and day after tomorrow
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

// reading required details from that js obj 
function weatherDetails(data) {
    if (data.cod == "404") { // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        let info = weather(data)
        console.log(info);
        //getting required properties value from the whole weather information
        for (i = 1; i <= 3; i++) {
        
             let city           = data.city.name;
             let  country       = data.city.country;
             let description    = info[`t${i}`].weather[0].description;
             let id             = info[`t${i}`].weather[0].id;
             let temp           = info[`t${i}`].main.temp;
             let feels_like     = info[`t${i}`].main.feels_like;
             let humidity       =info[`t${i}`].main.humidity;
            
             
            weatherPart = wrapper.querySelector(`.weather-part${i}`), //passing a particular weather info to a particular element

                wIcon = weatherPart.querySelector("img")  // using custom weather icon according to the id which api gives to us
            if (id == 800) {
                wIcon.src = "icons/clear.svg";
            } else if (id >= 200 && id <= 232) {
                wIcon.src = "icons/storm.svg";
            } else if (id >= 600 && id <= 622) {
                wIcon.src = "icons/snow.svg";
            } else if (id >= 701 && id <= 781) {
                wIcon.src = "icons/haze.svg";
            } else if (id >= 801 && id <= 804) {
                wIcon.src = "icons/cloud.svg";
            } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
                wIcon.src = "icons/rain.svg";
            }
            
            // placing the values that are requested from api into html 

            if (temp > 273) {       //if weather data fetched by using lat and long 

                weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp - 273);
                weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like - 273);
                weatherPart.querySelector(".weather").innerText = description;
                weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
                weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

            }
            else {      //if weather data fetched by using cityname
                weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
                weatherPart.querySelector(".weather").innerText = description;
                weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
                weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
                weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
            }
            infoTxt.classList.remove("pending", "error");
            infoTxt.innerText = "";
            inputField.value = "";
            wrapper.classList.add("active"); //adding class active to wrapper to display weather information 
        }

    }
}

//to make hide the details box as soon user hits <-- button
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");//removes active class to it
});


