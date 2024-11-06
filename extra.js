locationBtn.addEventListener("click", () => {
    requestApi(inputField.value);
    // if (navigator.geolocation) { // if browser support geolocation api

    //     //if its gets sucessfully current location(lat,long)  then onSucess function called by passing position as argument 
    //     //else onError function by passing error
    //     navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // } else {
    //     alert("Your browser not support geolocation api");//if browser does not support geolocation api
    // }
});





//taking current position(lat,long) fetching data from weather api
function onSuccess(position) {
    const { latitude, longitude } = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=651af124a578161f891756fd4d7d40c6`;
    fetchData();
}




// if any error occur while getting user location then we'll show it in infoText
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


if (temp > 273) {       //if weather data fetched by using lat and long 

    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp - 273);
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like - 273);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

}
