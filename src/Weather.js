import { useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { TiThermometer, TiWeatherWindy, TiWeatherCloudy, TiWeatherShower, TiEye, TiWeatherSunny, TiTime } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";


function Weather() {
	const apiKey = process.env.REACT_APP_API_KEY;

	const rCity = useRef();

	const [city, setCity] = useState("");
	const [weatherData, setWeatherData] = useState(null);

	const hCity = (event) => { setCity(event.target.value); }

	const getData = (query) => {
		const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`;
		axios.get(apiUrl)
		.then(res => {
			setWeatherData(res.data);
		})
		.catch(err => {
			toast.error("Some error occured: " + err);
		});
	}

	const getWeatherFromGPS = (event) => {
		event.preventDefault();
		new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject("Geolocation is not supported by this Browser.");
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					}
					);
				}, (error) => {
					reject("Geolocation permission denied or unavailable.");
				}
			);
		})
		.then(({ lat, lon }) => {
			let query = `${lat},${lon}`;
			getData(query);
		})
		.catch(err => {
			toast.error("Some error occured: " + err);
		});
	}

	const getWeatherFromCity = (event) => {
		event.preventDefault();

		if (city === "") {
			toast.error("Please enter city name ");
			setWeatherData(null);
			rCity.current.focus();
			return;
		}

		if (city.trim() === "") {
			toast.error("City name cannot be empty spaces");
			setWeatherData(null);
			setCity("");
			rCity.current.focus();
			return;
		}

		getData(city);
	}

	return (
		<>
			<div className="weather-container">
			<h1> Weather App </h1>
			<form>
				<label> Enter City name to search weather for...</label>
				<input type="text" placeholder="Enter city name "
					ref={rCity} onChange={hCity} value={city} />
				<button onClick={getWeatherFromGPS}>Use Current location</button>
				<button onClick={getWeatherFromCity}>Get Weather</button>
				
			</form>
			{weatherData && (
				<div className="weather-data">
					<h2>{weatherData.location.name}, {weatherData.location.region},{" "}{weatherData.location.country}</h2>
					<div>
						<img src={weatherData.current.condition.icon} alt="weather icon" />
						<h3>{weatherData.current.condition.text}</h3>
					</div>
					<p><TiTime /> Local Time: {weatherData.location.localtime}</p>
					<p><TiThermometer /> Temp: {weatherData.current.temp_c}°C (Feels like: {weatherData.current.feelslike_c}°C)</p>
					<p><WiHumidity /> Humidity: {weatherData.current.humidity}%</p>
					<p><TiWeatherWindy /> Wind: {weatherData.current.wind_kph} kph ({weatherData.current.wind_dir})</p>
					<p><TiWeatherCloudy /> Cloud Cover: {weatherData.current.cloud}%</p>
					<p><TiEye /> Visibility: {weatherData.current.vis_km} km</p>
					<p><TiWeatherShower /> Precipitation: {weatherData.current.precip_mm} mm</p>
					<p><TiWeatherSunny /> UV Index: {weatherData.current.uv}</p>
					<p><TiTime /> Last Updated: {weatherData.current.last_updated}</p>
				</div >
			)
			}
		</div>
		</>
	);
}
export default Weather;