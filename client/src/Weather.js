import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { client } from './index'
import WeatherInfo from './WeatherInfo'
import './Weather.css'

function Weather() {
  const [weather, setWeather] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [unit, setUnit] = useState('F')
  const [query, setQuery] = useState({ type: 'getWeatherByZip', param: 'zip', value:'zip', placeholder: 'Zip Code'})
  const [locationLoading, setLocationLoading] = useState(false)
  const units = {
    'C': 'metric',
    'K': 'standard',
    'F': 'imperial',
  }

  async function getWeather() {
    let queryCall = `${query.type}(${query.param}:"${locationQuery}", units:${units[unit]}) {` 

    if(query.value === 'geo') {
      const params = query.param.split(" ")
      const vals = locationQuery.split(" ")
      queryCall = `${query.type}(${params[0]}:"${vals[0]}", ${params[1]}:"${vals[1]}", units:${units[unit]}) {`
    }

    try {
      const json = await client.query({
        query: gql`
        query {
          ${queryCall}
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
    if(value === 'geo') {
      queryObj = { type: 'getWeatherByCoords', param: 'lat lon', value:'geo', placeholder: 'Lat Lon'}
    }
    setQuery(queryObj)
    setLocationQuery('')
  }

  // Call get weather after location coords are fetched
  useEffect(() => {
    if(!locationLoading && locationQuery) {
      getWeather()
    }
  }, [locationLoading])

  const getCurrentPosition = async (e) => {
    e.preventDefault();
    updateQuery('geo')
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(function(position) {
      setLocationQuery(`${position.coords.latitude} ${position.coords.longitude}`)
      setLocationLoading(false)
    })
  }

  return (
    <div className="Weather">
      {weather ? <WeatherInfo weather={weather.data[query.type]} /> : ""}

      <form>
        <div className="useLocation" onClick={(e) => getCurrentPosition(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M12 2c3.196 0 6 2.618 6 5.602 0 3.093-2.493 7.132-6 12.661-3.507-5.529-6-9.568-6-12.661 0-2.984 2.804-5.602 6-5.602m0-2c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>
        </div>
        <select name="searchtype" className="search-type" onChange={(e) => updateQuery(e.target.value)} value={query.value}>
          <option value='zip'>Zip</option>
          <option value='city'>City</option>
          <option value='geo'>Coords</option>
        </select>
        <input
          value={locationLoading ? 'Getting location...' : locationQuery}
          disabled={locationLoading}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder={`${query.placeholder}`}
          autoComplete="off"
        />
        <select name="unit" onChange={(e) => { setUnit(e.target.value) }} value={unit}>
          <option value="F">F</option>
          <option value="C">C</option>
          <option value="K">K</option>
        </select>
        <button type="submit" onClick={(e) => {getWeather(); e.preventDefault()}}>Submit</button>
      </form>
    </div>
  );
}

export default Weather