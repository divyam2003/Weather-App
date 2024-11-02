// console.log('hi');
// const API_key = "e3f596cd2c29d1a55ba821f9439b19d0";

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} C`
//     document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails() {
//     try{
//         let city = "goa";
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
//         const data = await response.json();
//         console.log("data->" , data )

//         // let newPara = document.createElement('p');
//         // newPara.textContent = `${data?.main?.temp.toFixed(2)} C`
//         // document.body.appendChild(newPara);
//         renderWeatherInfo(data);
//     }
//     catch(err){
//         // Handle error here
//         console.log("error found",err);
//     }
// }


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//  initial variable needed?

let oldTab = userTab;
const API_key = "e3f596cd2c29d1a55ba821f9439b19d0";
oldTab.classList.add("current-tab");
getfromSessionStorage();
// ek kaam or pending hain?

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala conatiner is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle search wale tab pr tha per ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first for coordinated, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    // pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    // pass clicked tab as input paramter
    switchTab(searchTab);
});

// check is coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // local coordinates nahi mile then show grantlocation conatiner
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant conatiner invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API call
    try{
        // console.log("Hi");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        // console.log(response);
        // const data;
        // response.json().then(data => {
        //     console.log(data);
        //   });
        // console.log("hi");
        const data=await response.json()
        // console.log("hi--->");
        console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("error 118");
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch values form weatherInfo object and put in UI elements

    // to access multi JSON values we'll use optional chainning operator
    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?. sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // weatherIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessButton = document.querySelector("[data-grantAccess]");



function getLoaction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show and alert that not geoloaction support available
        console.log("NO geoloaction ava");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",getLoaction);


let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // console.log(searchInput.value);
    if(searchInput.value === "") return;
    else fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try { 
        // console.log(city);

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        console.log(response);

        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        // hw
        console.log("error in fetchSearchWeatherInfo 185");
    }
}