// services/countries.js
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountries = async filter => {
  const response = await axios.get(baseUrl)
  return response.data.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
}

export default { getCountries }
