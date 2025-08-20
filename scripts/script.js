const body = document.querySelector('.body');
const temp_txt_main = document.querySelector('.header__temp');
const city_txt_main = document.querySelector('.header__city');
const apparent_temp_txt = document.querySelector('.apparent__temp');
const wind_speed_txt = document.querySelector('.wind__speed');
const wind_direction_txt = document.querySelector('.wind__direction');
const wind_arrow_txt = document.querySelector('.wind__arrow');

const rain_percent_txt = document.querySelector('.rain__percent');
const cloudy_percent_txt = document.querySelector('.cloudy__percent');

const sun_rise_txt = document.querySelector('.day__sun-rise');
const sun_set_txt = document.querySelector('.day__sun-set');

const now = new Date();

let temperature;
let jsonGlobal;


fetch(`https://api.open-meteo.com/v1/forecast?latitude=48.7194&longitude=44.5018&daily=precipitation_probability_max,sunrise,sunset&hourly=temperature_2m,precipitation,precipitation_probability,apparent_temperature,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&current=is_day,cloud_cover,rain,showers,snowfall,precipitation&timezone=Europe%2FMoscow&forecast_days=1`)
    .then((result) => {
        return result.json();
    })
    .then(json => {
        const windDegree = json.hourly.wind_direction_10m[now.getHours()];
        const windSpeed = json.hourly.wind_speed_10m[now.getHours()];
        const rain_percent = json.hourly.precipitation_probability[now.getHours()];
        const cloudy_percent = json.hourly.cloud_cover[now.getHours()];
        const sun_rise = json.daily.sunrise[0].slice(-5);
        const sun_set = json.daily.sunset[0].slice(-5);
 
        jsonGlobal = json;
        temperature = json.hourly.temperature_2m[now.getHours()];
        console.log(json.hourly.time[now.getHours()]);
        console.log(temperature);
        console.log(json);
        temp_txt_main.textContent = temperature + '°C';
        city_txt_main.textContent = 'Волгоград';
        apparent_temp_txt.textContent = `Ощущается как ${json.hourly.apparent_temperature[now.getHours()]}°C`
        chooseTheme();
        textContentWind(windDegree, windSpeed);
        rain_percent_txt.textContent = `${rain_percent}%`;
        cloudy_percent_txt.textContent = `${cloudy_percent}%`;
        sun_rise_txt.textContent = `Восход: ${sun_rise}`;
        sun_set_txt.textContent = `Закат: ${sun_set}`;
    });

function chooseTheme(){
    if(0 <= now.getHours() && now.getHours() < 4 || 19 < now.getHours() && now.getHours() <= 23){
        body.classList.add('body--nigth-deep');
        chooseCloudyTheme('body--nigth-deep');
        console.log('night-deep');
    } else if(4 < now.getHours() && now.getHours() <= 6){
        body.classList.add('body--sun-rise');
        chooseCloudyTheme('body--sun-rise');
        console.log('night-deep');
    } else if(6 < now.getHours() && now.getHours() <= 17){
        body.classList.add('body--day');
        chooseCloudyTheme('body--day');
        console.log('day');
    } else if(17 < now.getHours() && now.getHours() <= 19){
        body.classList.add('body--sun-set');
        chooseCloudyTheme('body--sun-set');
        console.log('sun-set');
    } 
}

function chooseCloudyTheme(theme){
    const isCloudy = jsonGlobal.hourly.cloud_cover[now.getHours()];

    if(isCloudy > 5){
        body.classList.add(`${theme}-cloudy`);
    }
}

function degreesToDirection(degrees, format = 'short') {
    const directions = {
        short: ['Сев', 'СВ', 'Вос', 'ЮВ', 'Южн', 'ЮЗ', 'Зап', 'СЗ'],
        long: ['Север', 'Северо-Восток', 'Восток', 'Юго-Восток', 
               'Юг', 'Юго-Запад', 'Запад', 'Северо-Запад'],
        arrow: ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖']
    };
    
    const index = Math.round(degrees / 45) % 8;
    return directions[format][index];
}

function textContentWind(degree, speed){
    wind_speed_txt.textContent = `${speed} км/ч`;
    wind_direction_txt.textContent = degreesToDirection(degree, 'short');
    wind_arrow_txt.textContent = degreesToDirection(degree, 'arrow');
}