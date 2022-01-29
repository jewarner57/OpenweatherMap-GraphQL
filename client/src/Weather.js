import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './index'
import WeatherInfo from './WeatherInfo'
import './Weather.css'

function Weather() {
  const [weather, setWeather] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [unit, setUnit] = useState('F')
  const [query, setQuery] = useState({ type: 'getWeatherByZip', param: 'zip', value:'zip', placeholder: 'Zip Code'})
  const units = {
    'C': 'metric',
    'K': 'standard',
    'F': 'imperial',
  }

  async function getWeather() {
    try {
      const json = await client.query({
        query: gql`
        query {
          ${query.type}(${query.param}:"${locationQuery}", units:${units[unit]}) {
          temperature
          temp_min
          temp_max
          locationName
          description
          status
          message
        }
      }
      `
      })
      setWeather(json)
      console.log(weather)
    } catch (err) {
      console.log(err.message)
      setWeather({ data: { [`${query.type}`]: { status: '400', message: err.message } } })
    }
  }

  const updateQuery = (value) => {
    let queryObj = { type: 'getWeatherByZip', param: 'zip', value:'zip', placeholder: 'Zip Code'}
    if(value === 'city') {
      queryObj = { type: 'getWeatherByCityName', param: 'cityName', value:'city', placeholder: 'City Name'}
    }
    setQuery(queryObj)
    setLocationQuery('')
  }

  return (
    <div className="Weather">
      {weather ? <WeatherInfo weather={weather.data[query.type]} /> : ""}

      <form onSubmit={(e) => {
        e.preventDefault()
        getWeather()
      }}>
        <select name="searchtype" className="search-type" onChange={(e) => updateQuery(e.target.value)} value={query.value}>
          <option value='zip'>Zip</option>
          <option value='city'>City</option>
        </select>
        <input
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder={`${query.placeholder}`}
          autoComplete="off"
        />
        <select name="unit" onChange={(e) => { setUnit(e.target.value) }} value={unit}>
          <option value="F">F</option>
          <option value="C">C</option>
          <option value="K">K</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Weather


/*
          console.log(`query {
          ${query.type}(${query.param}:"${locationQuery}", units:${units[unit]}) {
          temperature
          temp_min
          temp_max
          locationName
          description
          status
          message
        }
      }`)
*/