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

const TIME_THEMES = [
    {
        name: 'Рассвет',
        theme: 'body--sun-rise',
        range: [4, 6],
    },
    {
        name: 'День',
        theme: 'body--day',
        range: [7, 16],
    },
    {
        name: 'Закат',
        theme: 'body--sun-set',
        range: [17, 19],
    },
    {
        name: 'Вечер',
        theme: 'body--nigth',
        range: [20, 23],
    },
    {
        name: 'Ночь',
        theme: 'body--nigth-deep',
        range: [0, 4],
    },
];

let temperature;
let jsonGlobal;

let savedWeather = {};

loadSavedWeather();

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
        const apparent_temperature = json.hourly.apparent_temperature[now.getHours()];
 
        jsonGlobal = json;
        temperature = json.hourly.temperature_2m[now.getHours()];
        console.log(json.hourly.time[now.getHours()]);
        console.log(temperature);
        console.log(json);
        temp_txt_main.textContent = temperature + '°C';
        city_txt_main.textContent = 'Волгоград';
        apparent_temp_txt.textContent = `Ощущается как ${apparent_temperature}°C`
        chooseTheme();
        textContentWind(windDegree, windSpeed);
        rain_percent_txt.textContent = `${rain_percent}%`;
        cloudy_percent_txt.textContent = `${cloudy_percent}%`;
        sun_rise_txt.textContent = `Восход: ${sun_rise}`;
        sun_set_txt.textContent = `Закат: ${sun_set}`;

        saveWeather(temperature,
                    apparent_temperature,
                    rain_percent,
                    cloudy_percent,
                    sun_rise,
                    sun_set,
                    windDegree,
                    windSpeed);
    });

function chooseTheme(){
    const hour = now.getHours();

    const currentTheme = TIME_THEMES.find(({ range }) => {
        const [start, end] = range;
        return hour >= start && hour <= end;
    });

    if (!currentTheme) return;

    body.classList.add(currentTheme.theme);
    chooseCloudyTheme(currentTheme.theme);
    console.log(currentTheme.theme);
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

function saveWeather(temp,
                    app_temp,
                    rain_per,
                    cloud_per,
                    sun_rise,
                    sun_set,
                    wind_deg,
                    wind_speed){
    savedWeather.temperature = temp;
    savedWeather.apparent_temperature = app_temp;
    savedWeather.rain_percent = rain_per;
    savedWeather.cloudy_percent = cloud_per;
    savedWeather.sun_rise = sun_rise;
    savedWeather.sun_set = sun_set;
    savedWeather.windDegree = wind_deg;
    savedWeather.windSpeed = wind_speed;
    localStorage.setItem('savedWeather', JSON.stringify(savedWeather));
    console.log('Данные сохраненны', localStorage.getItem('savedWeather'));
}

function loadSavedWeather(){
    const loadedWeather = JSON.parse(localStorage.getItem('savedWeather'));

    if(Object.keys(loadedWeather).length == 0){
        console.log('Хранилище пустое');
        return;
    };
    try{
        console.log('Данные из хранилища');
        temp_txt_main.textContent = loadedWeather.temperature + '°C';
        city_txt_main.textContent = 'Волгоград';
        apparent_temp_txt.textContent = `Ощущается как ${loadedWeather.apparent_temperature}°C`
        rain_percent_txt.textContent = `${loadedWeather.rain_percent}%`;
        cloudy_percent_txt.textContent = `${loadedWeather.cloudy_percent}%`;
        sun_rise_txt.textContent = `Восход: ${loadedWeather.sun_rise}`;
        sun_set_txt.textContent = `Закат: ${loadedWeather.sun_set}`;
        textContentWind(loadedWeather.windDegree, loadedWeather.windSpeed);
    } catch(error){
        console.log('Ошибка загрузки данных', error)
    }
    
}