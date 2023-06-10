// services/weather.js
import axios from 'axios'

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'

const getWeather = async (city, api_key) => {
  const response = await axios.get(`${baseUrl}?q=${city}&appid=${api_key}`)
  return response.data
}

export default { getWeather }
