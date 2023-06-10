import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState({})
  const [searchName, setSearchName] = useState('')

  const api_key = process.env.REACT_APP_API_KEY

  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
    countryService
      .getCountries(event.target.value)
      .then(countries => {
        setCountries(countries)
      })
  }

  const handleShowCountry = (country) => {
    setCountries([country])
  }

  return (
    <div>
      find countries <input value={searchName} onChange={handleSearchChange} />
      <Countries countries={countries} onShowCountry={handleShowCountry} weather={weather} setWeather={setWeather} api_key={api_key}/>
    </div>
  )
}

const Countries = ({ countries, onShowCountry, weather, setWeather, api_key}) => {
  useEffect(() => {
    if (countries.length === 1) {
      weatherService
        .getWeather(countries[0].capital, api_key)
        .then(weather => {
          setWeather(weather);
        });
    }
  }, [countries, setWeather, api_key]);

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} weather={weather} />
  } else {
    return (
      <div>
        {countries.map(country =>
          <div key={country.name.common}>
            {country.name.common} 
            <button onClick={() => onShowCountry(country)}>Show</button>
          </div>
        )}
      </div>
    )
  }
}

const Country = ({ country, weather }) => {
  console.log(weather)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => 
          <li key={code}>{name}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} height="100" />
      {weather.main && weather.weather ? 
        <>
          <h3>Weather in {country.capital}</h3>
          <div><strong>temperature:</strong> {weather.main.temp - 273.15} Celcius</div>
          <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={`weather in ${country.capital}`} />
          <div><strong>wind:</strong> {weather.wind.speed} m/s direction {weather.wind.deg} degrees</div>
        </>
        : <div>Loading weather data...</div>
      }
    </div>
  )
}


export default App
